import ListWhatsAppsService from "../WhatsappService/ListWhatsAppsService";
import { StartWhatsAppSession } from "./StartWhatsAppSession";
import { StartWhatsAppSessionEvolution } from "./StartWhatsAppSessionEvolution";
import * as Sentry from "@sentry/node";

export const StartAllWhatsAppsSessions = async (
  companyId: number
): Promise<void> => {
  try {
    const whatsapps = await ListWhatsAppsService({ companyId });
    if (whatsapps.length > 0) {
      whatsapps.forEach(whatsapp => {
        if (whatsapp.channel !== "whatsapp") return;

        if (whatsapp.provider === "evolution") {
          StartWhatsAppSessionEvolution(whatsapp, companyId);
        } else {
          StartWhatsAppSession(whatsapp, companyId);
        }
      });
    }
  } catch (e) {
    Sentry.captureException(e);
  }
};
