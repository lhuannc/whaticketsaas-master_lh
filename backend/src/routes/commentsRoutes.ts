import { Router } from "express";
import isAuth from "../middleware/isAuth";
import * as CommentsController from "../controllers/CommentsController";

const commentsRoutes = Router();

commentsRoutes.get("/comments", isAuth, CommentsController.index);
commentsRoutes.get("/comments/posts", isAuth, CommentsController.posts);
commentsRoutes.post("/comments/:commentId/reply", isAuth, CommentsController.reply);
commentsRoutes.post("/comments/:commentId/spam", isAuth, CommentsController.spam);
commentsRoutes.post("/comments/:commentId/convert-to-dm", isAuth, CommentsController.convertToDM);

export default commentsRoutes;
