import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import { logger } from "../utils/logger";
import { getIO } from "../libs/socket";
import Whatsapp from "../models/Whatsapp";
import CreateOrUpdateContactService from "../services/ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../services/TicketServices/FindOrCreateTicketService";
import CreateMessageService from "../services/MessageServices/CreateMessageService";

interface EvolutionMessageUpsert {
  event: "messages.upsert";
  instance: string;
  data: {
    key: {
      id: string;
      remoteJid: string;
      fromMe: boolean;
      participant?: string;
    };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: { text: string };
      imageMessage?: { caption?: string; url?: string };
      videoMessage?: { caption?: string; url?: string };
      audioMessage?: { url?: string };
      documentMessage?: { fileName?: string; url?: string };
    };
    messageType: string;
    messageTimestamp: number;
  };
  destination: string;
}

interface EvolutionConnectionUpdate {
  event: "connection.update";
  instance: string;
  data: {
    state: "open" | "close" | "connecting";
    statusReason?: number;
  };
}

interface EvolutionQrcodeUpdated {
  event: "qrcode.updated";
  instance: string;
  data: {
    qrcode: {
      base64: string;
      code: string;
    };
  };
}

const extractMessageBody = (msg: EvolutionMessageUpsert["data"]["message"]): string => {
  if (!msg) return "";
  return (
    msg.conversation ||
    msg.extendedTextMessage?.text ||
    msg.imageMessage?.caption ||
    msg.videoMessage?.caption ||
    msg.documentMessage?.fileName ||
    ""
  );
};

const extractMediaUrl = (msg: EvolutionMessageUpsert["data"]["message"]): string | undefined => {
  if (!msg) return undefined;
  return (
    msg.imageMessage?.url ||
    msg.videoMessage?.url ||
    msg.audioMessage?.url ||
    msg.documentMessage?.url
  );
};

const getMediaType = (messageType: string): string => {
  if (messageType.includes("image")) return "image";
  if (messageType.includes("video")) return "video";
  if (messageType.includes("audio")) return "audio";
  if (messageType.includes("document")) return "document";
  return "chat";
};

const handleMessageUpsert = async (
  payload: EvolutionMessageUpsert,
  whatsapp: Whatsapp
): Promise<void> => {
  const { data, instance } = payload;
  const companyId = whatsapp.companyId;

  const remoteJid = data.key.remoteJid;
  if (!remoteJid) return;

  const isGroup = remoteJid.endsWith("@g.us");
  const stripJid = (jid: string) => jid.replace(/@s\.whatsapp\.net|@g\.us|@lid/g, "");

  let contact;        // contato emissor da mensagem (participante em grupo)
  let groupContact;   // contato do grupo (apenas se grupo)

  if (isGroup) {
    // Grupo: cria contato do grupo + contato do participante (quem enviou)
    const groupNumber = stripJid(remoteJid);
    groupContact = await CreateOrUpdateContactService({
      name: data.pushName || groupNumber,
      number: groupNumber,
      isGroup: true,
      companyId,
      channel: "whatsapp"
    });

    // participant = jid real do remetente dentro do grupo
    const participantJid = data.key.participant || remoteJid;
    const participantNumber = stripJid(participantJid);
    contact = await CreateOrUpdateContactService({
      name: data.pushName || participantNumber,
      number: participantNumber,
      isGroup: false,
      companyId,
      channel: "whatsapp"
    });
  } else {
    const number = stripJid(remoteJid);
    contact = await CreateOrUpdateContactService({
      name: data.pushName || number,
      number,
      isGroup: false,
      companyId,
      channel: "whatsapp"
    });
  }

  // Ticket vinculado ao grupo (groupContact) ou ao contato direto
  const ticket = await FindOrCreateTicketService(
    contact,
    whatsapp.id,
    1,
    companyId,
    groupContact
  );

  const body = extractMessageBody(data.message);
  const mediaUrl = extractMediaUrl(data.message);
  const mediaType = getMediaType(data.messageType);

  await CreateMessageService({
    messageData: {
      id: data.key.id,
      ticketId: ticket.id,
      contactId: contact.id, // emissor real (participante em grupo)
      body,
      fromMe: data.key.fromMe,
      read: data.key.fromMe,
      mediaType: mediaType !== "chat" ? mediaType : undefined,
      mediaUrl,
      channel: "whatsapp"
    },
    companyId
  });

  // Executa flow/URA quando mensagem do cliente e ticket ainda em bot (sem operador/fila)
  if (!data.key.fromMe && !ticket.userId && !ticket.queueId) {
    try {
      const { processFlowMessage } = await import("../services/FlowServices/FlowExecutorService");
      await processFlowMessage(ticket, contact, body);
    } catch (err) {
      Sentry.captureException(err);
    }
  }
};

const handleConnectionUpdate = async (
  payload: EvolutionConnectionUpdate,
  whatsapp: Whatsapp
): Promise<void> => {
  const { data } = payload;
  const companyId = whatsapp.companyId;
  const io = getIO();

  let status: string;
  switch (data.state) {
    case "open":
      status = "CONNECTED";
      break;
    case "connecting":
      status = "OPENING";
      break;
    case "close":
    default:
      status = "DISCONNECTED";
  }

  await whatsapp.update({ status, qrcode: status === "CONNECTED" ? "" : whatsapp.qrcode });

  io.to(`company:${companyId}`).emit(`company-${companyId}-whatsapp`, {
    action: "update",
    whatsapp: whatsapp.get()
  });
};

const handleQrcodeUpdated = async (
  payload: EvolutionQrcodeUpdated,
  whatsapp: Whatsapp
): Promise<void> => {
  const companyId = whatsapp.companyId;
  const io = getIO();
  const qrcode = payload.data?.qrcode?.base64 || "";

  await whatsapp.update({ qrcode, status: "qrcode" });

  io.to(`company:${companyId}`).emit(`company-${companyId}-whatsappSession`, {
    action: "update",
    session: { ...whatsapp.get(), qrcode, status: "qrcode" }
  });
};

export const evolutionWebhook = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const body = req.body as EvolutionMessageUpsert | EvolutionConnectionUpdate | EvolutionQrcodeUpdated;

    if (!body?.event || !body?.instance) {
      return res.sendStatus(400);
    }

    logger.info(`[EvolutionWebhook] event=${body.event} instance=${body.instance}`);

    const whatsapp = await Whatsapp.findOne({
      where: { evolutionInstanceName: body.instance }
    });

    if (!whatsapp) {
      logger.warn(`[EvolutionWebhook] Unknown instance: ${body.instance}`);
      return res.sendStatus(200);
    }

    switch (body.event) {
      case "messages.upsert":
        await handleMessageUpsert(body as EvolutionMessageUpsert, whatsapp);
        break;
      case "connection.update":
        await handleConnectionUpdate(body as EvolutionConnectionUpdate, whatsapp);
        break;
      case "qrcode.updated":
        await handleQrcodeUpdated(body as EvolutionQrcodeUpdated, whatsapp);
        break;
      default:
        break;
    }

    return res.sendStatus(200);
  } catch (err) {
    Sentry.captureException(err);
    logger.error(`[EvolutionWebhook] Error: ${err}`);
    return res.sendStatus(500);
  }
};
