import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import Ticket from "../models/Ticket";

import CreateTicketService from "../services/TicketServices/CreateTicketService";
import DeleteTicketService from "../services/TicketServices/DeleteTicketService";
import ListTicketsService from "../services/TicketServices/ListTicketsService";
import ShowTicketUUIDService from "../services/TicketServices/ShowTicketFromUUIDService";
import ShowTicketService from "../services/TicketServices/ShowTicketService";
import UpdateTicketService from "../services/TicketServices/UpdateTicketService";
import ListTicketsServiceKanban from "../services/TicketServices/ListTicketsServiceKanban";
import ListTicketsFunnelService from "../services/TicketServices/ListTicketsFunnelService";
import TransferInstanceService from "../services/TicketServices/TransferInstanceService";
import ForwardTicketService from "../services/TicketServices/ForwardTicketService";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
  status: string;
  date: string;
  updatedAt?: string;
  showAll: string;
  withUnreadMessages: string;
  queueIds: string;
  tags: string;
  users: string;
};

interface TicketData {
  contactId: number;
  status: string;
  queueId: number;
  userId: number;
  justClose: boolean;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const {
    pageNumber,
    status,
    date,
    updatedAt,
    searchParam,
    showAll,
    queueIds: queueIdsStringified,
    tags: tagIdsStringified,
    users: userIdsStringified,
    withUnreadMessages
  } = req.query as IndexQuery;

  const userId = req.user.id;
  const { companyId } = req.user;

  let queueIds: number[] = [];
  let tagsIds: number[] = [];
  let usersIds: number[] = [];

  if (queueIdsStringified) {
    queueIds = JSON.parse(queueIdsStringified);
  }

  if (tagIdsStringified) {
    tagsIds = JSON.parse(tagIdsStringified);
  }

  if (userIdsStringified) {
    usersIds = JSON.parse(userIdsStringified);
  }

  const { tickets, count, hasMore } = await ListTicketsService({
    searchParam,
    tags: tagsIds,
    users: usersIds,
    pageNumber,
    status,
    date,
    updatedAt,
    showAll,
    userId,
    queueIds,
    withUnreadMessages,
    companyId
  });

  return res.status(200).json({ tickets, count, hasMore });
};

export const kanban = async (req: Request, res: Response): Promise<Response> => {
  const {
    pageNumber,
    status,
    date,
    updatedAt,
    searchParam,
    showAll,
    queueIds: queueIdsStringified,
    tags: tagIdsStringified,
    users: userIdsStringified,
    withUnreadMessages
  } = req.query as IndexQuery;


  const userId = req.user.id;
  const { companyId } = req.user;

  let queueIds: number[] = [];
  let tagsIds: number[] = [];
  let usersIds: number[] = [];

  if (queueIdsStringified) {
    queueIds = JSON.parse(queueIdsStringified);
  }

  if (tagIdsStringified) {
    tagsIds = JSON.parse(tagIdsStringified);
  }

  if (userIdsStringified) {
    usersIds = JSON.parse(userIdsStringified);
  }
  console.log("withUnreadMessages")

  console.log(withUnreadMessages)
  const { tickets, count, hasMore } = await ListTicketsServiceKanban({
    searchParam,
    tags: tagsIds,
    users: usersIds,
    pageNumber,
    status,
    date,
    updatedAt,
    showAll,
    userId,
    queueIds,
    withUnreadMessages,
    companyId

  });

  return res.status(200).json({ tickets, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { contactId, status, userId, queueId }: TicketData = req.body;
  const { companyId } = req.user;

  const ticket = await CreateTicketService({
    contactId,
    status,
    userId,
    companyId,
    queueId
  });

  const io = getIO();
  io.to(ticket.status).emit(`company-${companyId}-ticket`, {
    action: "update",
    ticket
  });

  return res.status(200).json(ticket);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;

  const contact = await ShowTicketService(ticketId, companyId);

  return res.status(200).json(contact);
};

export const showFromUUID = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { uuid } = req.params;

  const ticket: Ticket = await ShowTicketUUIDService(uuid);

  return res.status(200).json(ticket);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;
  const ticketData: TicketData = req.body;
  const { companyId } = req.user;

  const { ticket } = await UpdateTicketService({
    ticketData,
    ticketId,
    companyId
  });

  return res.status(200).json(ticket);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { ticketId } = req.params;
  const { companyId } = req.user;

  await ShowTicketService(ticketId, companyId);

  const ticket = await DeleteTicketService(ticketId);

  const io = getIO();
  io.to(ticket.status)
    .to(ticketId)
    .to("notification")
    .emit(`company-${companyId}-ticket`, {
      action: "delete",
      ticketId: +ticketId
    });

  return res.status(200).json({ message: "ticket deleted" });
};

export const funnel = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { funnelStage, queueIds: queueIdsStringified } = req.query as Record<string, string>;

  let queueIds: number[] = [];
  if (queueIdsStringified) {
    queueIds = JSON.parse(queueIdsStringified);
  }

  const { stages, totals } = await ListTicketsFunnelService({
    companyId,
    funnelStage,
    userId: req.user.id,
    queueIds
  });

  return res.status(200).json({ stages, totals });
};

export const transferInstance = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { targetWhatsappId, notifyContact, transferMessage } = req.body;
  const { companyId } = req.user;

  const ticket = await TransferInstanceService({
    ticketId,
    targetWhatsappId,
    companyId,
    notifyContact,
    transferMessage
  });

  return res.status(200).json(ticket);
};

export const forwardTicket = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { targetNumber, includeHistory, historyLimit } = req.body;
  const { companyId } = req.user;

  await ForwardTicketService({ ticketId, targetNumber, companyId, includeHistory, historyLimit });

  return res.status(200).json({ message: "Conversa encaminhada com sucesso." });
};

export const updateFunnel = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId } = req.params;
  const { funnelStage, dealValue } = req.body;
  const { companyId } = req.user;

  const ticket = await ShowTicketService(ticketId, companyId);

  const updates: Record<string, any> = {};
  if (funnelStage !== undefined) updates.funnelStage = funnelStage;
  if (dealValue !== undefined) updates.dealValue = dealValue;

  await ticket.update(updates);

  const io = getIO();
  io.to(`company:${companyId}`).emit(`company-${companyId}-ticket`, {
    action: "funnel-updated",
    ticket,
    ticketId: ticket.id
  });

  return res.status(200).json(ticket);
};
