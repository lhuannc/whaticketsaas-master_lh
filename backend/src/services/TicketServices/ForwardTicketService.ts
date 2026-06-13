import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import Message from "../../models/Message";
import ShowTicketService from "./ShowTicketService";
import evolutionApi from "../../libs/evolutionApi";
import GetTicketWbot from "../../helpers/GetTicketWbot";

interface ForwardRequest {
  ticketId: number | string;
  targetNumber: string;
  companyId: number;
  includeHistory?: boolean;
  historyLimit?: number;
}

const formatHistory = (messages: Message[]): string => {
  return messages
    .slice(-50)
    .map(m => {
      const time = new Date(m.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const who = m.fromMe ? "Atendente" : "Cliente";
      return `[${time}] ${who}: ${m.body || "(mídia)"}`;
    })
    .join("\n");
};

const ForwardTicketService = async ({
  ticketId,
  targetNumber,
  companyId,
  includeHistory = true,
  historyLimit = 30
}: ForwardRequest): Promise<void> => {
  const ticket = await ShowTicketService(ticketId, companyId);
  const whatsapp = await Whatsapp.findByPk(ticket.whatsappId);

  if (!whatsapp || whatsapp.companyId !== companyId) {
    throw new AppError("ERR_WHATSAPP_NOT_FOUND");
  }

  const cleanNumber = targetNumber.replace(/\D/g, "");
  const toJid = `${cleanNumber}@s.whatsapp.net`;

  let bodyText = `*Encaminhamento de atendimento*\n`;
  bodyText += `Contato: ${ticket.contact?.name || ticket.contact?.number}\n`;
  bodyText += `Canal: ${ticket.channel}\n`;

  if (includeHistory) {
    const messages = await Message.findAll({
      where: { ticketId: ticket.id },
      order: [["createdAt", "ASC"]],
      limit: historyLimit
    });

    if (messages.length > 0) {
      bodyText += `\n*Histórico da conversa:*\n${formatHistory(messages)}`;
    }
  }

  if (whatsapp.provider === "evolution" && whatsapp.evolutionInstanceName) {
    await evolutionApi.sendText(whatsapp.evolutionInstanceName, toJid, bodyText);
  } else {
    const wbot = await GetTicketWbot(ticket);
    await wbot.sendMessage(toJid, { text: bodyText });
  }
};

export default ForwardTicketService;
