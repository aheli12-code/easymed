import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function main() {
  await connectDB();

  const app = createApp();
  const httpServer = createServer(app);

  const io = new SocketIOServer(httpServer, {
    cors: { origin: env.clientOrigin, credentials: true },
  });

  io.on("connection", (socket) => {
    logger.info("socket connected", { id: socket.id });

    // Example: join a per-user room for targeted notifications
    socket.on("join", (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      logger.info("socket disconnected", { id: socket.id });
    });
  });

  // Make io available to controllers/services that need to emit events
  app.set("io", io);

  httpServer.listen(env.port, () => {
    logger.info(`Core API listening on port ${env.port}`);
  });
}

main().catch((err) => {
  logger.error("Fatal startup error", { error: err.message, stack: err.stack });
  process.exit(1);
});
