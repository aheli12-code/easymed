import { logger } from "../utils/logger.js";
import { ZodError } from "zod";

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (err instanceof ZodError) {
    return res.status(400).json({ message: "Validation error", issues: err.issues });
  }

  const status = err.status || 500;
  if (status >= 500) {
    logger.error(err.message, { stack: err.stack, path: req.path });
  }

  res.status(status).json({
    message: status >= 500 ? "Internal server error" : err.message,
  });
}
