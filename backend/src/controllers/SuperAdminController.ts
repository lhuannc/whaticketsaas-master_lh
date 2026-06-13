import { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { Op } from "sequelize";
import * as Sentry from "@sentry/node";
import AppError from "../errors/AppError";
import authConfig from "../config/auth";
import Company from "../models/Company";
import User from "../models/User";
import Whatsapp from "../models/Whatsapp";
import Plan from "../models/Plan";
import { getIO } from "../libs/socket";
import evolutionApi from "../libs/evolutionApi";

export const listCompanies = async (req: Request, res: Response): Promise<Response> => {
  const {
    searchParam = "",
    status,
    page = "1",
    limit = "20"
  } = req.query as Record<string, string>;

  const where: Record<string, any> = {};
  if (searchParam) {
    where.name = { [Op.iLike]: `%${searchParam}%` };
  }
  if (status) {
    where.status = status;
  }

  const offset = (parseInt(page) - 1) * parseInt(limit);

  const { count, rows: companies } = await Company.findAndCountAll({
    where,
    include: [{ model: Plan, as: "plan", attributes: ["name", "users", "connections"] }],
    order: [["dueDate", "ASC"]],
    limit: parseInt(limit),
    offset
  });

  const summary = companies.map(c => ({
    id: c.id,
    name: c.name,
    status: c.status,
    dueDate: c.dueDate,
    plan: (c as any).plan?.name,
    phone: c.phone,
    email: c.email
  }));

  return res.json({ count, companies: summary, hasMore: offset + companies.length < count });
};

export const updateCompanyStatus = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.params;
  const { status } = req.body;

  if (!["active", "blocked", "trial"].includes(status)) {
    throw new AppError("ERR_INVALID_STATUS");
  }

  const company = await Company.findByPk(companyId);
  if (!company) throw new AppError("ERR_COMPANY_NOT_FOUND", 404);

  await company.update({ status });

  if (status === "blocked") {
    const whatsapps = await Whatsapp.findAll({ where: { companyId } });
    for (const wa of whatsapps) {
      if (wa.provider === "evolution" && wa.evolutionInstanceName) {
        try {
          await evolutionApi.logoutInstance(wa.evolutionInstanceName);
        } catch (err) {
          Sentry.captureException(err);
        }
      }
    }

    const io = getIO();
    io.to(`company:${companyId}`).emit(`company-${companyId}-auth`, {
      action: "blocked",
      message: "Conta bloqueada. Entre em contato com o suporte."
    });
  }

  return res.json({ id: company.id, status: company.status });
};

export const impersonate = async (req: Request, res: Response): Promise<Response> => {
  const { companyId } = req.params;
  const superAdminId = req.user.id;

  const company = await Company.findByPk(companyId);
  if (!company) throw new AppError("ERR_COMPANY_NOT_FOUND", 404);

  const adminUser = await User.findOne({
    where: { companyId, profile: "admin" },
    order: [["id", "ASC"]]
  });

  if (!adminUser) throw new AppError("ERR_NO_ADMIN_IN_COMPANY");

  const impersonateToken = sign(
    {
      id: adminUser.id,
      profile: adminUser.profile,
      companyId: adminUser.companyId,
      impersonatedBy: superAdminId
    },
    authConfig.secret,
    { expiresIn: "2h" }
  );

  return res.json({
    token: impersonateToken,
    user: {
      id: adminUser.id,
      name: adminUser.name,
      email: adminUser.email,
      companyId: adminUser.companyId
    }
  });
};

export const getMetrics = async (req: Request, res: Response): Promise<Response> => {
  const totalCompanies = await Company.count();
  const activeCompanies = await Company.count({ where: { status: "active" } });
  const trialCompanies = await Company.count({ where: { status: "trial" } });
  const blockedCompanies = await Company.count({ where: { status: "blocked" } });

  return res.json({
    totalCompanies,
    activeCompanies,
    trialCompanies,
    blockedCompanies
  });
};
