import { Server as SocketIO } from "socket.io";
import { Server } from "http";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";
import User from "../models/User";

let io: SocketIO;

export const initIO = (httpServer: Server): SocketIO => {
  io = new SocketIO(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL
    },
    pingInterval: 25000,
    pingTimeout: 60000
  });

  io.on("connection", async socket => {
    logger.info("Client Connected");
    const { userId } = socket.handshake.query;

    if (userId && userId !== "undefined" && userId !== "null") {
      const parsedUserId = parseInt(userId as string, 10);
      if (!isNaN(parsedUserId)) {
        const user = await User.findByPk(parsedUserId, { attributes: ["id", "companyId", "online"] });
        if (user) {
          user.online = true;
          await user.save();
          // Isola cliente no room da sua empresa
          socket.join(`company:${user.companyId}`);
          logger.info(`User ${parsedUserId} joined room company:${user.companyId}`);
        }
      }
    }

    socket.on("joinChatBox", (ticketId: string) => {
      socket.join(ticketId);
    });

    socket.on("joinNotification", () => {
      socket.join("notification");
    });

    socket.on("joinTickets", (status: string) => {
      socket.join(status);
    });

    // Presença: operador informa disponibilidade
    socket.on("operatorPresence", async (data: { userId: number; presence: string }) => {
      const user = await User.findByPk(data.userId, { attributes: ["id", "companyId"] });
      if (user) {
        socket.to(`company:${user.companyId}`).emit(`company-${user.companyId}-operator`, {
          action: "presence",
          userId: data.userId,
          presence: data.presence
        });
      }
    });

    socket.on("disconnect", async () => {
      if (userId && userId !== "undefined" && userId !== "null") {
        const parsedUserId = parseInt(userId as string, 10);
        if (!isNaN(parsedUserId)) {
          const user = await User.findByPk(parsedUserId, { attributes: ["id", "companyId", "online"] });
          if (user) {
            user.online = false;
            await user.save();
          }
        }
      }
    });
  });
  return io;
};

export const getIO = (): SocketIO => {
  if (!io) {
    throw new AppError("Socket IO not initialized");
  }
  return io;
};
