import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as LinkedinOAuthController from "../controllers/LinkedinOAuthController";

const linkedinRoutes = Router();

linkedinRoutes.get("/linkedin/auth", LinkedinOAuthController.authRedirect);
linkedinRoutes.get("/linkedin/callback", LinkedinOAuthController.authCallback);
linkedinRoutes.get("/linkedin/account", isAuth, LinkedinOAuthController.getAccount);
linkedinRoutes.delete("/linkedin/disconnect", isAuth, LinkedinOAuthController.disconnect);

export default linkedinRoutes;
