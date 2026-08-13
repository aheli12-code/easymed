import { z } from "zod";
import { authService } from "../services/auth.service.js";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["patient", "doctor", "admin"]).default("patient"),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const requestResetSchema = z.object({
  email: z.string().email(),
});

const confirmResetSchema = z.object({
  userId: z.string().min(1),
  token: z.string().min(1),
  newPassword: z.string().min(8),
});

const REFRESH_COOKIE = "refreshToken";
const cookieOpts = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const authController = {
  async register(req, res, next) {
    try {
      const data = registerSchema.parse(req.body);
      const user = await authService.register(data);
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const data = loginSchema.parse(req.body);
      const { user, accessToken, refreshToken } = await authService.login(data);
      res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts);
      res.json({
        accessToken,
        user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const token = req.cookies?.[REFRESH_COOKIE];
      if (!token) {
        return res.status(401).json({ message: "Missing refresh token" });
      }
      const { accessToken } = await authService.refresh(token);
      res.json({ accessToken });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      if (req.user?.sub) await authService.logout(req.user.sub);
      res.clearCookie(REFRESH_COOKIE, cookieOpts);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async requestPasswordReset(req, res, next) {
    try {
      const { email } = requestResetSchema.parse(req.body);
      await authService.requestPasswordReset(email);
      // Same response whether or not the email exists, to avoid user enumeration
      res.json({ message: "If that email is registered, a reset link has been sent." });
    } catch (err) {
      next(err);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const data = confirmResetSchema.parse(req.body);
      await authService.resetPassword(data);
      res.json({ message: "Password updated. Please log in again." });
    } catch (err) {
      next(err);
    }
  },
};
