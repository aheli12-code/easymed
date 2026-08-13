import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { userRepository } from "../repositories/user.repository.js";
import { env } from "../config/env.js";
import { sendMail } from "../utils/mailer.js";
import { User } from "../models/User.js";

const SALT_ROUNDS = 12;
const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

function signAccessToken(user) {
  return jwt.sign({ sub: user._id, role: user.role }, env.jwt.accessSecret, {
    expiresIn: env.jwt.accessExpiresIn,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id }, env.jwt.refreshSecret, {
    expiresIn: env.jwt.refreshExpiresIn,
  });
}

export const authService = {
  async register({ name, email, password, role }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error("Email already registered");
      err.status = 409;
      throw err;
    }
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await userRepository.create({ name, email, passwordHash, role });
    return user;
  },

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      throw err;
    }

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    await userRepository.updateRefreshTokenHash(user._id, refreshTokenHash);

    return { user, accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    let payload;
    try {
      payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
    } catch {
      const err = new Error("Invalid or expired refresh token");
      err.status = 401;
      throw err;
    }
    const user = await userRepository.findById(payload.sub);
    if (!user || !user.refreshTokenHash) {
      const err = new Error("Refresh token revoked");
      err.status = 401;
      throw err;
    }
    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      const err = new Error("Refresh token revoked");
      err.status = 401;
      throw err;
    }
    return { accessToken: signAccessToken(user) };
  },

  async logout(userId) {
    await userRepository.updateRefreshTokenHash(userId, null);
  },

  async requestPasswordReset(email) {
    const user = await userRepository.findByEmail(email);
    // Always resolve without error, even if the email doesn't exist —
    // don't leak which emails are registered.
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = await bcrypt.hash(rawToken, SALT_ROUNDS);
    user.resetTokenHash = resetTokenHash;
    user.resetTokenExpiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
    await user.save();

    const resetLink = `${env.clientOrigin}/reset-password?uid=${user._id}&token=${rawToken}`;
    await sendMail({
      to: user.email,
      subject: "Reset your EasyMed password",
      text: `Reset your password: ${resetLink}\nThis link expires in 30 minutes.`,
      html: `<p>Reset your password by clicking <a href="${resetLink}">this link</a>.</p><p>This link expires in 30 minutes.</p>`,
    });
  },

  async resetPassword({ userId, token, newPassword }) {
    const user = await User.findById(userId);
    const invalidErr = () => {
      const err = new Error("Invalid or expired reset token");
      err.status = 400;
      throw err;
    };

    if (!user || !user.resetTokenHash || !user.resetTokenExpiresAt) invalidErr();
    if (user.resetTokenExpiresAt < new Date()) invalidErr();

    const matches = await bcrypt.compare(token, user.resetTokenHash);
    if (!matches) invalidErr();

    user.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.resetTokenHash = null;
    user.resetTokenExpiresAt = null;
    user.refreshTokenHash = null; // force re-login everywhere
    await user.save();
  },
};
