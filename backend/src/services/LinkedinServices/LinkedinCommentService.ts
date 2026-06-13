import axios from "axios";
import { logger } from "../../utils/logger";
import * as Sentry from "@sentry/node";
import { getIO } from "../../libs/socket";
import Comment from "../../models/Comment";
import LinkedinAccount from "../../models/LinkedinAccount";
import Contact from "../../models/Contact";
import CreateOrUpdateContactService from "../ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketServiceMeta from "../TicketServices/FindOrCreateTicketServiceMeta";
import Whatsapp from "../../models/Whatsapp";

const liApi = (token: string) =>
  axios.create({
    baseURL: "https://api.linkedin.com/v2/",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Restli-Protocol-Version": "2.0.0"
    }
  });

export const replyToLiComment = async (
  commentUrn: string,
  organizationUrn: string,
  text: string,
  accessToken: string
): Promise<void> => {
  await liApi(accessToken).post(`socialActions/${encodeURIComponent(commentUrn)}/comments`, {
    actor: organizationUrn,
    message: { text }
  });
};

export const likeLiComment = async (
  commentUrn: string,
  actorUrn: string,
  accessToken: string
): Promise<void> => {
  await liApi(accessToken).post(`reactions`, {
    actor: actorUrn,
    reactionType: "LIKE",
    object: commentUrn
  });
};

export const getLiOrganizationPosts = async (
  organizationId: string,
  accessToken: string
): Promise<string[]> => {
  try {
    const { data } = await liApi(accessToken).get(`ugcPosts`, {
      params: {
        q: "authors",
        authors: `List(urn:li:organization:${organizationId})`,
        count: 10
      }
    });
    return (data?.elements || []).map((p: any) => p.id);
  } catch (err) {
    logger.error(`[LI] getLiOrganizationPosts error: ${err}`);
    return [];
  }
};

export const getLiPostComments = async (
  postUrn: string,
  accessToken: string
): Promise<any[]> => {
  try {
    const { data } = await liApi(accessToken).get(
      `socialActions/${encodeURIComponent(postUrn)}/comments`,
      { params: { count: 50 } }
    );
    return data?.elements || [];
  } catch (err) {
    logger.error(`[LI] getLiPostComments error for ${postUrn}: ${err}`);
    return [];
  }
};

export const pollLinkedinComments = async (
  liAccount: LinkedinAccount
): Promise<void> => {
  const companyId = liAccount.companyId;
  const io = getIO();

  try {
    const organizationUrn = `urn:li:organization:${liAccount.liOrganizationId}`;
    const postUrns = await getLiOrganizationPosts(liAccount.liOrganizationId, liAccount.accessToken);

    for (const postUrn of postUrns) {
      const comments = await getLiPostComments(postUrn, liAccount.accessToken);

      for (const raw of comments) {
        const externalCommentId = raw.id;

        const existing = await Comment.findOne({ where: { externalCommentId, companyId } });
        if (existing) continue;

        const authorId = raw.actor?.replace("urn:li:person:", "") || raw.actor;
        const authorName = raw.actor || "LinkedIn User";

        const contact = await CreateOrUpdateContactService({
          name: authorName,
          number: authorId,
          isGroup: false,
          companyId,
          channel: "linkedin"
        });

        const whatsapp = await Whatsapp.findOne({ where: { companyId, channel: "linkedin" } });
        let ticketId: number | null = null;
        if (whatsapp) {
          const ticket = await FindOrCreateTicketServiceMeta(
            contact,
            whatsapp.id,
            1,
            companyId,
            "linkedin"
          );
          ticketId = ticket.id;
        }

        const comment = await Comment.create({
          companyId,
          ticketId,
          contactId: contact.id,
          channelType: "linkedin",
          externalCommentId,
          postId: postUrn,
          authorName,
          body: raw.message?.text || "",
          likeCount: raw.likesSummary?.totalLikes || 0,
          isSpam: false,
          isReplied: false,
          externalCreatedAt: raw.created?.time ? new Date(raw.created.time) : new Date()
        });

        io.to(`company:${companyId}`).emit(`company-${companyId}-comment`, {
          action: "create",
          comment
        });
      }
    }

    await liAccount.update({ lastPollAt: new Date() });
  } catch (err) {
    Sentry.captureException(err);
    logger.error(`[LI Poll] company ${companyId}: ${err}`);
  }
};
