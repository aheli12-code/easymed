import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", requireAuth, authController.logout);
authRouter.post("/request-password-reset", authController.requestPasswordReset);
authRouter.post("/reset-password", authController.resetPassword);
