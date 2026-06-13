import * as Sentry from "@sentry/node";
import { getIO } from "../../libs/socket";
import AppError from "../../errors/AppError";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import Message from "../../models/Message";
import ShowTicketService from "./ShowTicketService";
import CreateMessageService from "../MessageServices/CreateMessageService";
import SendWhatsAppMessage from "../WbotServices/SendWhatsAppMessage";
import SendWhatsAppMessageEvolution from "../WbotServices/SendWhatsAppMessageEvolution";

interface TransferInstanceRequest {
  ticketId: number | string;
  targetWhatsappId: number;
  companyId: number;
  notifyContact?: boolean;
  transferMessage?: string;
}

const DEFAULT_TRANSFER_MSG = "‎Você foi transferido para outro número. Em breve continuaremos seu atendimento.";

const TransferInstanceService = async ({
  ticketId,
  targetWhatsappId,
  companyId,
  notifyContact = true,
  transferMessage = DEFAULT_TRANSFER_MSG
}: TransferInstanceRequest): Promise<Ticket> => {
  const ticket = await ShowTicketService(ticketId, companyId);

  if (ticket.whatsappId === targetWhatsappId) {
    throw new AppError("ERR_TRANSFER_SAME_INSTANCE");
  }

  const targetWhatsapp = await Whatsapp.findOne({
    where: { id: targetWhatsappId, companyId }
  });

  if (!targetWhatsapp) throw new AppError("ERR_WHATSAPP_NOT_FOUND");
  if (targetWhatsapp.status !== "CONNECTED") throw new AppError("ERR_WHATSAPP_DISCONNECTED");

  if (notifyContact && ticket.channel === "whatsapp") {
    try {
      if (targetWhatsapp.provider === "evolution") {
        const tempTicket = { ...ticket.get(), whatsappId: targetWhatsappId, whatsapp: targetWhatsapp } as any;
        await SendWhatsAppMessageEvolution({ body: transferMessage, ticket: tempTicket });
      } else {
        await SendWhatsAppMessage({ body: transferMessage, ticket });
      }
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  await ticket.update({
    whatsappId: targetWhatsappId,
    userId: null,
    status: "pending"
  });

  await CreateMessageService({
    messageData: {
      id: `sys-transfer-${Date.now()}`,
      ticketId: ticket.id,
      body: `Conversa transferida para: ${targetWhatsapp.name || targetWhatsapp.id}`,
      fromMe: true,
      read: true,
      mediaType: "system",
      channel: "whatsapp"
    },
    companyId
  });

  const updated = await ShowTicketService(ticket.id, companyId);

  const io = getIO();
  io.to(`company:${companyId}`).emit(`company-${companyId}-ticket`, {
    action: "update",
    ticket: updated
  });

  return updated;
};

export default TransferInstanceService;
