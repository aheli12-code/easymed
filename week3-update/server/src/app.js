import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { doctorRouter } from "./routes/doctor.routes.js";
import { appointmentRouter } from "./routes/appointment.routes.js";
import { recordRouter } from "./routes/record.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use("/api", apiLimiter);

  app.get("/health", (req, res) => res.json({ status: "ok", service: "core-api" }));

  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/doctors", doctorRouter);
  app.use("/api/appointments", appointmentRouter);
  app.use("/api/records", recordRouter);

  // Serve uploaded record files. In production, swap for signed S3/Cloudinary
  // URLs instead of serving from local disk.
  app.use("/uploads", express.static("uploads"));

  // 404
  app.use((req, res) => res.status(404).json({ message: "Not found" }));

  app.use(errorHandler);

  return app;
}
