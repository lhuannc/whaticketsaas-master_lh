import { Request, Response, NextFunction } from "express";
import AppError from "../errors/AppError";
import User from "../models/User";

const isSuperAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const user = await User.findByPk(req.user.id, {
    attributes: ["id", "super"]
  });

  if (!user?.super) {
    throw new AppError("ERR_FORBIDDEN", 403);
  }

  return next();
};

export default isSuperAdmin;
