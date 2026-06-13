import * as Sentry from "@sentry/node";
import AppError from "../../errors/AppError";
import evolutionApi from "../../libs/evolutionApi";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import Whatsapp from "../../models/Whatsapp";
import formatBody from "../../helpers/Mustache";

interface Request {
  body: string;
  ticket: Ticket;
  quotedMsg?: Message;
}

const getInstanceName = async (ticket: Ticket): Promise<string> => {
  const whatsapp = ticket.whatsapp || (await Whatsapp.findByPk(ticket.whatsappId));
  if (!whatsapp?.evolutionInstanceName) {
    throw new AppError("ERR_EVOLUTION_INSTANCE_NOT_FOUND");
  }
  return whatsapp.evolutionInstanceName;
};

const SendWhatsAppMessageEvolution = async ({
  body,
  ticket,
  quotedMsg
}: Request): Promise<void> => {
  try {
    const instanceName = await getInstanceName(ticket);
    const number = `${ticket.contact.number}@${ticket.isGroup ? "g.us" : "s.whatsapp.net"}`;
    const formattedBody = formatBody(body, ticket.contact);

    await evolutionApi.sendText(
      instanceName,
      number,
      formattedBody,
      quotedMsg?.id
    );

    await ticket.update({ lastMessage: formattedBody });
  } catch (err) {
    Sentry.captureException(err);
    throw new AppError("ERR_SENDING_WAPP_MSG");
  }
};

export default SendWhatsAppMessageEvolution;
