import axios from "axios";
import { logger } from "../../utils/logger";
import * as Sentry from "@sentry/node";

const igApi = (token: string) =>
  axios.create({
    baseURL: "https://graph.facebook.com/v18.0/",
    params: { access_token: token }
  });

export const replyToIgComment = async (
  commentId: string,
  message: string,
  accessToken: string
): Promise<{ id: string }> => {
  const { data } = await igApi(accessToken).post(`${commentId}/replies`, {
    message
  });
  return data;
};

export const hideIgComment = async (
  commentId: string,
  hide: boolean,
  accessToken: string
): Promise<void> => {
  await igApi(accessToken).post(`${commentId}`, {
    hide
  });
};

export const getIgCommentAuthorDmThread = async (
  igUserId: string,
  commentId: string,
  accessToken: string
): Promise<string | null> => {
  try {
    const { data } = await igApi(accessToken).post(`me/messages`, {
      recipient: { comment_id: commentId },
      message: { text: "." },
      messaging_type: "RESPONSE"
    });
    return data?.recipient_id || null;
  } catch (err) {
    logger.warn(`[IG] Could not create DM thread from comment ${commentId}: ${err}`);
    return null;
  }
};

export const getIgMediaComments = async (
  mediaId: string,
  accessToken: string,
  cursor?: string
): Promise<{ data: any[]; paging?: any }> => {
  try {
    const params: Record<string, string> = {
      fields: "id,text,username,timestamp,like_count,replies{id,text,username,timestamp}",
      limit: "50"
    };
    if (cursor) params.after = cursor;

    const { data } = await igApi(accessToken).get(`${mediaId}/comments`, { params });
    return data;
  } catch (err) {
    Sentry.captureException(err);
    logger.error(`[IG] getMediaComments error: ${err}`);
    return { data: [] };
  }
};

export const getIgUserMedia = async (
  igUserId: string,
  accessToken: string
): Promise<{ data: any[] }> => {
  const { data } = await igApi(accessToken).get(`${igUserId}/media`, {
    params: {
      fields: "id,caption,media_type,media_url,thumbnail_url,timestamp,like_count,comments_count",
      limit: "20"
    }
  });
  return data;
};
