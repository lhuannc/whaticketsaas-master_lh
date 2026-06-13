import { Request, Response } from "express";
import * as Sentry from "@sentry/node";
import AppError from "../errors/AppError";
import runCopilot from "../services/AiServices/CopilotService";

export const suggest = async (req: Request, res: Response): Promise<Response> => {
  const { ticketId, action, draft, historyLimit } = req.body;
  const { companyId } = req.user;

  if (!ticketId || !action) throw new AppError("ERR_AI_MISSING_PARAMS");
  if (!["suggest", "correct", "summarize"].includes(action)) {
    throw new AppError("ERR_AI_INVALID_ACTION");
  }
  if (action === "correct" && !draft) throw new AppError("ERR_AI_DRAFT_REQUIRED");

  try {
    const result = await runCopilot({ ticketId, companyId, action, draft, historyLimit });
    return res.json({ result });
  } catch (err: any) {
    Sentry.captureException(err);
    throw new AppError(err.message || "ERR_AI_COPILOT");
  }
};
