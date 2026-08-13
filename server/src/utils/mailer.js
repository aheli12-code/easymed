import nodemailer from "nodemailer";
import { logger } from "./logger.js";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    // Dev fallback: log emails to the console instead of sending them
    transporter = {
      sendMail: async (opts) => {
        logger.info("DEV EMAIL (no SMTP configured)", opts);
        return { messageId: "dev-mode" };
      },
    };
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export async function sendMail({ to, subject, text, html }) {
  const mailer = getTransporter();
  return mailer.sendMail({
    from: process.env.SMTP_FROM || "no-reply@easymed.local",
    to,
    subject,
    text,
    html,
  });
}
