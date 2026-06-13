import { Router } from "express";
import isAuth from "../middleware/isAuth";
import isSuperAdmin from "../middleware/isSuperAdmin";
import * as SuperAdminController from "../controllers/SuperAdminController";

const superAdminRoutes = Router();

superAdminRoutes.use(isAuth, isSuperAdmin);

superAdminRoutes.get("/super-admin/companies", SuperAdminController.listCompanies);
superAdminRoutes.patch("/super-admin/companies/:companyId/status", SuperAdminController.updateCompanyStatus);
superAdminRoutes.post("/super-admin/companies/:companyId/impersonate", SuperAdminController.impersonate);
superAdminRoutes.get("/super-admin/metrics", SuperAdminController.getMetrics);

export default superAdminRoutes;
