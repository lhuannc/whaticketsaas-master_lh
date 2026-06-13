import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as InstagramOAuthController from "../controllers/InstagramOAuthController";

const instagramRoutes = Router();

instagramRoutes.get("/instagram/auth", InstagramOAuthController.authRedirect);
instagramRoutes.get("/instagram/callback", InstagramOAuthController.authCallback);
instagramRoutes.get("/instagram/account", isAuth, InstagramOAuthController.getAccount);
instagramRoutes.delete("/instagram/disconnect", isAuth, InstagramOAuthController.disconnect);

export default instagramRoutes;
