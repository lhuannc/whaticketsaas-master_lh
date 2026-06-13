import { Router } from "express";
import { evolutionWebhook } from "../controllers/EvolutionWebhookController";

const evolutionWebhookRoutes = Router();

evolutionWebhookRoutes.post("/", evolutionWebhook);

export default evolutionWebhookRoutes;
