import axios from "axios";
import LinkedinAccount from "../../models/LinkedinAccount";
import { logger } from "../../utils/logger";

const LI_TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";
const LI_API = "https://api.linkedin.com/v2";

export const getLiOAuthUrl = (companyId: number): string => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.BACKEND_URL}/api/linkedin/callback`;
  const scope = "r_organization_social w_organization_social r_1st_connections_size";
  const state = Buffer.from(JSON.stringify({ companyId })).toString("base64");

  return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}`;
};

export const exchangeLiCode = async (code: string, companyId: number): Promise<LinkedinAccount> => {
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.BACKEND_URL}/api/linkedin/callback`;

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri,
    client_id: process.env.LINKEDIN_CLIENT_ID!,
    client_secret: process.env.LINKEDIN_CLIENT_SECRET!
  });

  const { data: tokenData } = await axios.post(LI_TOKEN_URL, params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const tokenExpiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

  const { data: orgData } = await axios.get(`${LI_API}/organizationAcls`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { q: "roleAssignee", role: "ADMINISTRATOR", state: "APPROVED" }
  });

  const firstOrg = orgData?.elements?.[0];
  if (!firstOrg) throw new Error("No LinkedIn organization found for this account");

  const orgUrn = firstOrg.organization;
  const orgId = orgUrn.replace("urn:li:organization:", "");

  const { data: orgProfile } = await axios.get(`${LI_API}/organizations/${orgId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: { fields: "id,name,logoV2" }
  });

  const orgName = orgProfile?.localizedName || orgProfile?.name?.localized?.["pt_BR"] || orgId;
  const orgLogo = orgProfile?.logoV2?.original || null;

  const existing = await LinkedinAccount.findOne({ where: { companyId } });
  if (existing) {
    await existing.update({
      liOrganizationId: orgId,
      liOrganizationName: orgName,
      liOrganizationLogo: orgLogo,
      accessToken,
      refreshToken,
      tokenExpiresAt,
      status: "connected"
    });
    return existing;
  }

  return LinkedinAccount.create({
    companyId,
    liOrganizationId: orgId,
    liOrganizationName: orgName,
    liOrganizationLogo: orgLogo,
    accessToken,
    refreshToken,
    tokenExpiresAt,
    status: "connected"
  });
};

export const refreshLiTokenIfNeeded = async (account: LinkedinAccount): Promise<void> => {
  if (!account.refreshToken || !account.tokenExpiresAt) return;
  const daysUntilExpiry = (account.tokenExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  if (daysUntilExpiry > 7) return;

  try {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: account.refreshToken,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!
    });

    const { data } = await axios.post(LI_TOKEN_URL, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    await account.update({
      accessToken: data.access_token,
      refreshToken: data.refresh_token || account.refreshToken,
      tokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      status: "connected"
    });

    logger.info(`[LI OAuth] Refreshed token for company ${account.companyId}`);
  } catch (err) {
    logger.error(`[LI OAuth] Token refresh failed for company ${account.companyId}: ${err}`);
    await account.update({ status: "token_expired" });
  }
};
