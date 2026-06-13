import * as Sentry from "@sentry/node";
import path from "path";
import mime from "mime-types";
import AppError from "../../errors/AppError";
import evolutionApi from "../../libs/evolutionApi";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";

interface Request {
  media: Express.Multer.File;
  ticket: Ticket;
  body?: string;
}

const getInstanceName = async (ticket: Ticket): Promise<string> => {
  const whatsapp = ticket.whatsapp || (await Whatsapp.findByPk(ticket.whatsappId));
  if (!whatsapp?.evolutionInstanceName) {
    throw new AppError("ERR_EVOLUTION_INSTANCE_NOT_FOUND");
  }
  return whatsapp.evolutionInstanceName;
};

const getMediaType = (mimeType: string): "image" | "video" | "audio" | "document" => {
  const type = mimeType.split("/")[0];
  if (type === "image") return "image";
  if (type === "video") return "video";
  if (type === "audio") return "audio";
  return "document";
};

const SendWhatsAppMediaEvolution = async ({
  media,
  ticket,
  body
}: Request): Promise<void> => {
  try {
    const instanceName = await getInstanceName(ticket);
    const number = `${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:8080";
    const mediaUrl = `${backendUrl}/public/${media.filename}`;
    const mimeType = media.mimetype || mime.lookup(media.originalname) || "application/octet-stream";
    const mediaType = getMediaType(mimeType as string);

    if (mediaType === "audio") {
      await evolutionApi.sendAudio(instanceName, number, mediaUrl);
    } else {
      await evolutionApi.sendMedia(
        instanceName,
        number,
        mediaUrl,
        mediaType,
        body || "",
        media.originalname
      );
    }

    await ticket.update({ lastMessage: media.filename });
  } catch (err) {
    Sentry.captureException(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMediaEvolution;
