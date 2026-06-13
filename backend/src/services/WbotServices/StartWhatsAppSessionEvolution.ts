import Whatsapp from "../../models/Whatsapp";
import { getIO } from "../../libs/socket";
import evolutionApi from "../../libs/evolutionApi";
import { logger } from "../../utils/logger";
import * as Sentry from "@sentry/node";

const buildInstanceName = (whatsapp: Whatsapp): string =>
  `company${whatsapp.companyId}-wa${whatsapp.id}`;

const buildWebhookUrl = (): string => {
  const base = process.env.BACKEND_URL || "http://localhost:8080";
  return `${base}/webhook/evolution`;
};

export const StartWhatsAppSessionEvolution = async (
  whatsapp: Whatsapp,
  companyId: number
): Promise<void> => {
  const io = getIO();

  try {
    await whatsapp.update({ status: "OPENING" });
    io.to(`company:${companyId}`).emit(`company-${companyId}-whatsappSession`, {
      action: "update",
      session: whatsapp
    });

    const instanceName = whatsapp.evolutionInstanceName || buildInstanceName(whatsapp);

    if (!whatsapp.evolutionInstanceName) {
      await whatsapp.update({ evolutionInstanceName: instanceName });
    }

    const webhookToken = whatsapp.token || "";
    const webhookUrl = buildWebhookUrl();

    const instances = await evolutionApi.listInstances();
    const exists = instances.some(i => i.instanceName === instanceName);

    if (!exists) {
      await evolutionApi.createInstance(instanceName, webhookUrl, webhookToken);
      logger.info(`[Evolution] Created instance: ${instanceName}`);
    }

    const { qrcode } = await evolutionApi.connectInstance(instanceName);

    if (qrcode) {
      await whatsapp.update({ qrcode, status: "qrcode" });
      io.to(`company:${companyId}`).emit(`company-${companyId}-whatsappSession`, {
        action: "update",
        session: { ...whatsapp.get(), qrcode, status: "qrcode" }
      });
    }
  } catch (err) {
    Sentry.captureException(err);
    logger.error(`[Evolution] StartSession error for whatsappId=${whatsapp.id}: ${err}`);
    await whatsapp.update({ status: "DISCONNECTED" });
    io.to(`company:${companyId}`).emit(`company-${companyId}-whatsappSession`, {
      action: "update",
      session: { ...whatsapp.get(), status: "DISCONNECTED" }
    });
  }
};

export const StopWhatsAppSessionEvolution = async (
  whatsapp: Whatsapp
): Promise<void> => {
  try {
    if (whatsapp.evolutionInstanceName) {
      await evolutionApi.logoutInstance(whatsapp.evolutionInstanceName);
    }
    await whatsapp.update({ status: "DISCONNECTED", qrcode: "" });
  } catch (err) {
    Sentry.captureException(err);
    logger.error(`[Evolution] StopSession error: ${err}`);
  }
};
