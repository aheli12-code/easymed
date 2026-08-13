import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing access token" });
  }
  const token = header.slice("Bearer ".length);
  try {
    req.user = jwt.verify(token, env.jwt.accessSecret); // { sub, role, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired access token" });
  }
}
