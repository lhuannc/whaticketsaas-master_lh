import { Request, Response } from "express";
import { verify } from "jsonwebtoken";
import * as Sentry from "@sentry/node";
import AppError from "../errors/AppError";
import authConfig from "../config/auth";
import InstagramAccount from "../models/InstagramAccount";
import {
  getIgOAuthUrl,
  exchangeIgCode
} from "../services/InstagramServices/InstagramOAuthService";

// Sem isAuth: popup do browser não envia header Bearer. Token vem via query.
export const authRedirect = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.query as Record<string, string>;
  try {
    const decoded = verify(token, authConfig.secret) as { companyId: number };
    const url = getIgOAuthUrl(decoded.companyId);
    res.redirect(url);
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

export const authCallback = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { code, state, error } = req.query as Record<string, string>;

    if (error) throw new AppError(`Instagram OAuth error: ${error}`);
    if (!code || !state) throw new AppError("ERR_IG_OAUTH_MISSING_PARAMS");

    const { companyId } = JSON.parse(Buffer.from(state, "base64").toString());
    await exchangeIgCode(code, companyId);

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    res.redirect(`${frontendUrl}/management/channels?ig=connected`);
    return;
  } catch (err) {
    Sentry.captureException(err);
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAccount = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  const account = await InstagramAccount.findOne({
    where: { companyId },
    attributes: ["id", "igUsername", "status", "tokenExpiresAt", "pageId"]
  });
  return res.json(account || null);
};

export const disconnect = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.user;
  await InstagramAccount.destroy({ where: { companyId } });
  return res.json({ message: "Instagram account disconnected" });
};
