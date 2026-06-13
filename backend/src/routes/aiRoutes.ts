import { Router } from "express";
import isAuth from "../middleware/isAuth";
import { suggest } from "../controllers/AiController";

const aiRoutes = Router();

aiRoutes.post("/ai/suggest", isAuth, suggest);

export default aiRoutes;
