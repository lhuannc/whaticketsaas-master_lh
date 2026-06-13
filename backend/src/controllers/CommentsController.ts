import { Request, Response } from "express";
import { Op } from "sequelize";
import * as Sentry from "@sentry/node";
import AppError from "../errors/AppError";
import Comment from "../models/Comment";
import Contact from "../models/Contact";
import InstagramAccount from "../models/InstagramAccount";
import { replyToIgComment, hideIgComment } from "../services/InstagramServices/InstagramCommentService";
import { getIO } from "../libs/socket";

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const {
    channelType,
    isReplied,
    isSpam,
    postId,
    page = "1",
    limit = "20"
  } = req.query as Record<string, string>;

  const where: Record<string, any> = { companyId };
  if (channelType) where.channelType = channelType;
  if (isReplied !== undefined) where.isReplied = isReplied === "true";
  if (isSpam !== undefined) where.isSpam = isSpam === "true";
  if (postId) where.postId = postId;

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: comments } = await Comment.findAndCountAll({
    where,
    include: [{ model: Contact, as: "contact", attributes: ["id", "name", "profilePicUrl"] }],
    order: [["externalCreatedAt", "DESC"]],
    limit: parseInt(limit),
    offset
  });

  return res.json({ count, comments, hasMore: offset + comments.length < count });
};

export const reply = async (req: Request, res: Response): Promise<Response> => {
  const { commentId } = req.params;
  const { body } = req.body;
  const { companyId } = req.user;

  if (!body) throw new AppError("ERR_COMMENT_BODY_REQUIRED");

  const comment = await Comment.findOne({ where: { id: commentId, companyId } });
  if (!comment) throw new AppError("ERR_COMMENT_NOT_FOUND", 404);

  if (comment.channelType === "instagram") {
    const igAccount = await InstagramAccount.findOne({ where: { companyId } });
    if (!igAccount) throw new AppError("ERR_IG_ACCOUNT_NOT_FOUND");

    await replyToIgComment(comment.externalCommentId, body, igAccount.accessToken);
  } else {
    throw new AppError("ERR_CHANNEL_NOT_SUPPORTED");
  }

  await comment.update({ isReplied: true, repliedAt: new Date() });

  const io = getIO();
  io.to(`company:${companyId}`).emit(`company-${companyId}-comment`, {
    action: "update",
    comment
  });

  return res.json(comment);
};

export const spam = async (req: Request, res: Response): Promise<Response> => {
  const { commentId } = req.params;
  const { companyId } = req.user;

  const comment = await Comment.findOne({ where: { id: commentId, companyId } });
  if (!comment) throw new AppError("ERR_COMMENT_NOT_FOUND", 404);

  if (comment.channelType === "instagram") {
    const igAccount = await InstagramAccount.findOne({ where: { companyId } });
    if (!igAccount) throw new AppError("ERR_IG_ACCOUNT_NOT_FOUND");

    await hideIgComment(comment.externalCommentId, true, igAccount.accessToken);
  }

  await comment.update({ isSpam: true });

  return res.json(comment);
};

export const posts = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const { channelType } = req.query as Record<string, string>;

  const where: Record<string, any> = { companyId };
  if (channelType && channelType !== "all") where.channelType = channelType;

  // Agrega por postId: total + pendentes
  const map: Record<string, { postId: string; channelType: string; total: number; pending: number }> = {};
  const allComments = await Comment.findAll({ where, attributes: ["postId", "channelType", "isReplied", "isSpam"], raw: true });
  allComments.forEach((c: any) => {
    const key = c.postId || "sem-post";
    if (!map[key]) map[key] = { postId: c.postId, channelType: c.channelType, total: 0, pending: 0 };
    map[key].total += 1;
    if (!c.isReplied && !c.isSpam) map[key].pending += 1;
  });

  return res.json({ posts: Object.values(map) });
};

export const convertToDM = async (req: Request, res: Response): Promise<Response> => {
  const { commentId } = req.params;
  const { companyId } = req.user;

  const comment = await Comment.findOne({ where: { id: commentId, companyId } });
  if (!comment) throw new AppError("ERR_COMMENT_NOT_FOUND", 404);
  if (!comment.contactId) throw new AppError("ERR_COMMENT_NO_CONTACT");

  // O listener de comentários já cria/vincula ticket ao contato.
  // Aqui garantimos o ticket e retornamos p/ o front navegar.
  let ticketId = comment.ticketId;

  if (!ticketId) {
    const FindOrCreateTicketServiceMeta = (
      await import("../services/TicketServices/FindOrCreateTicketServiceMeta")
    ).default;
    const Whatsapp = (await import("../models/Whatsapp")).default;
    const contact = await Contact.findByPk(comment.contactId);
    const wpp = await Whatsapp.findOne({ where: { companyId, channel: comment.channelType } });
    if (contact && wpp) {
      const ticket = await FindOrCreateTicketServiceMeta(contact, wpp.id, 1, companyId, comment.channelType);
      ticketId = ticket.id;
      await comment.update({ ticketId });
    }
  }

  if (!ticketId) throw new AppError("ERR_COULD_NOT_CREATE_DM");

  return res.json({ ticketId });
};
