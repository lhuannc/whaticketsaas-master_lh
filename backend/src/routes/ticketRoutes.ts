import express from "express";
import isAuth from "../middleware/isAuth";

import * as TicketController from "../controllers/TicketController";

const ticketRoutes = express.Router();

ticketRoutes.get("/tickets", isAuth, TicketController.index);

ticketRoutes.get("/ticket/kanban", isAuth, TicketController.kanban);

ticketRoutes.get("/tickets/funnel", isAuth, TicketController.funnel);

ticketRoutes.get("/tickets/:ticketId", isAuth, TicketController.show);

ticketRoutes.get("/tickets/u/:uuid", isAuth, TicketController.showFromUUID);

ticketRoutes.post("/tickets", isAuth, TicketController.store);

ticketRoutes.put("/tickets/:ticketId", isAuth, TicketController.update);

ticketRoutes.delete("/tickets/:ticketId", isAuth, TicketController.remove);

ticketRoutes.patch("/tickets/:ticketId/funnel", isAuth, TicketController.updateFunnel);
ticketRoutes.post("/tickets/:ticketId/transfer-instance", isAuth, TicketController.transferInstance);
ticketRoutes.post("/tickets/:ticketId/forward", isAuth, TicketController.forwardTicket);

export default ticketRoutes;
