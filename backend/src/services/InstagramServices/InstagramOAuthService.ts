import axios from "axios";
import InstagramAccount from "../../models/InstagramAccount";
import { logger } from "../../utils/logger";

const IG_OAUTH_URL = "https://api.instagram.com/oauth/access_token";
const GRAPH_URL = "https://graph.facebook.com/v18.0";

export const getIgOAuthUrl = (companyId: number): string => {
  const clientId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.BACKEND_URL}/api/instagram/callback`;
  const scope = "instagram_basic,instagram_manage_messages,instagram_manage_comments,pages_manage_metadata,pages_read_engagement";
  const state = Buffer.from(JSON.stringify({ companyId })).toString("base64");

  return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&response_type=code`;
};

export const exchangeIgCode = async (code: string, companyId: number): Promise<InstagramAccount> => {
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI || `${process.env.BACKEND_URL}/api/instagram/callback`;

  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID!,
    client_secret: process.env.FACEBOOK_APP_SECRET!,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code
  });

  const { data: tokenData } = await axios.post(IG_OAUTH_URL, params);
  const shortToken = tokenData.access_token;
  const userId = tokenData.user_id?.toString();

  const { data: longTokenData } = await axios.get(`${GRAPH_URL}/oauth/access_token`, {
    params: {
      grant_type: "fb_exchange_token",
      client_id: process.env.FACEBOOK_APP_ID,
      client_secret: process.env.FACEBOOK_APP_SECRET,
      fb_exchange_token: shortToken
    }
  });

  const accessToken = longTokenData.access_token;
  const expiresIn: number = longTokenData.expires_in || 5184000;
  const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

  const { data: profile } = await axios.get(`${GRAPH_URL}/${userId}`, {
    params: { fields: "id,username", access_token: accessToken }
  });

  const existing = await InstagramAccount.findOne({ where: { companyId } });
  if (existing) {
    await existing.update({
      igUserId: profile.id,
      igUsername: profile.username,
      accessToken,
      tokenExpiresAt,
      status: "connected"
    });
    return existing;
  }

  return InstagramAccount.create({
    companyId,
    igUserId: profile.id,
    igUsername: profile.username,
    accessToken,
    tokenExpiresAt,
    status: "connected"
  });
};

export const refreshIgTokenIfNeeded = async (account: InstagramAccount): Promise<void> => {
  if (!account.tokenExpiresAt) return;
  const daysUntilExpiry = (account.tokenExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysUntilExpiry > 7) return;

  try {
    const { data } = await axios.get(`${GRAPH_URL}/oauth/access_token`, {
      params: {
        grant_type: "ig_refresh_token",
        access_token: account.accessToken
      }
    });
    const tokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
    await account.update({ accessToken: data.access_token, tokenExpiresAt, status: "connected" });
    logger.info(`[IG OAuth] Refreshed token for company ${account.companyId}`);
  } catch (err) {
    logger.error(`[IG OAuth] Token refresh failed for company ${account.companyId}: ${err}`);
    await account.update({ status: "token_expired" });
  }
};
