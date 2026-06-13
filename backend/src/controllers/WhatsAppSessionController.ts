import { Request, Response } from "express";
import { getWbot, removeWbot } from "../libs/wbot";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";
import {
  StartWhatsAppSessionEvolution,
  StopWhatsAppSessionEvolution
} from "../services/WbotServices/StartWhatsAppSessionEvolution";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import DeleteBaileysService from "../services/BaileysServices/DeleteBaileysService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import { cacheLayer } from "../libs/cache";

const startSession = async (whatsapp: any, companyId: number): Promise<void> => {
  if (whatsapp.provider === "evolution") {
    await StartWhatsAppSessionEvolution(whatsapp, companyId);
  } else {
    await StartWhatsAppSession(whatsapp, companyId);
  }
};

const store = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { companyId } = req.user;

  const whatsapp = await ShowWhatsAppService(whatsappId, companyId);
  await startSession(whatsapp, companyId);

  return res.status(200).json({ message: "Starting session." });
};

const update = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { companyId } = req.user;

  const { whatsapp } = await UpdateWhatsAppService({
    whatsappId,
    companyId,
    whatsappData: { session: "" }
  });

  if (whatsapp.channel === "whatsapp") {
    await startSession(whatsapp, companyId);
  }

  return res.status(200).json({ message: "Starting session." });
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const { companyId } = req.user;

  const whatsapp = await ShowWhatsAppService(whatsappId, companyId);

  if (whatsapp.channel === "whatsapp") {
    if (whatsapp.provider === "evolution") {
      await StopWhatsAppSessionEvolution(whatsapp);
    } else {
      const wbot = getWbot(whatsapp.id);
      wbot.logout();
      wbot.ws.close();
    }
  }

  if (whatsapp.channel === "facebook" || whatsapp.channel === "instagram") {
    whatsapp.destroy();
  }

  return res.status(200).json({ message: "Session disconnected." });
};

export default { store, remove, update };
