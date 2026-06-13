import * as Sentry from "@sentry/node";
import { logger } from "../../utils/logger";
import { getIO } from "../../libs/socket";
import Comment from "../../models/Comment";
import Whatsapp from "../../models/Whatsapp";
import InstagramAccount from "../../models/InstagramAccount";
import CreateOrUpdateContactService from "../ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketServiceMeta from "../TicketServices/FindOrCreateTicketServiceMeta";

interface IgCommentEntry {
  id: string;
  time: number;
  changes: Array<{
    value: {
      from: { id: string; username?: string };
      media: { id: string };
      id: string;
      text: string;
      created_time: number;
    };
    field: string;
  }>;
}

export const handleInstagramCommentWebhook = async (
  entry: IgCommentEntry,
  igAccount: InstagramAccount
): Promise<void> => {
  const companyId = igAccount.companyId;
  const io = getIO();

  for (const change of entry.changes) {
    if (change.field !== "comments") continue;

    const { value } = change;
    const externalCommentId = value.id;

    const existing = await Comment.findOne({
      where: { externalCommentId, companyId }
    });
    if (existing) continue;

    const contact = await CreateOrUpdateContactService({
      name: value.from?.username || value.from?.id,
      number: value.from?.id,
      isGroup: false,
      companyId,
      channel: "instagram",
      channelUsername: value.from?.username
    } as any);

    const whatsapp = await Whatsapp.findOne({
      where: { companyId, channel: "instagram" }
    });

    let ticketId: number | null = null;
    if (whatsapp) {
      const ticket = await FindOrCreateTicketServiceMeta(
        contact,
        whatsapp.id,
        1,
        companyId,
        "instagram"
      );
      ticketId = ticket.id;
    }

    const comment = await Comment.create({
      companyId,
      ticketId,
      contactId: contact.id,
      channelType: "instagram",
      externalCommentId,
      postId: value.media?.id,
      authorName: value.from?.username || value.from?.id,
      authorUsername: value.from?.username,
      body: value.text,
      isSpam: false,
      isReplied: false,
      externalCreatedAt: value.created_time
        ? new Date(value.created_time * 1000)
        : new Date()
    });

    io.to(`company:${companyId}`).emit(`company-${companyId}-comment`, {
      action: "create",
      comment
    });

    logger.info(`[IG Comment] Saved comment ${externalCommentId} for company ${companyId}`);
  }
};
