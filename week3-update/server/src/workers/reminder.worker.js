import { Worker } from "bullmq";
import { env } from "../config/env.js";
import { sendMail } from "../utils/mailer.js";
import { logger } from "../utils/logger.js";

function parseRedisUrl(url) {
  const u = new URL(url);
  return { host: u.hostname, port: Number(u.port || 6379) };
}

const connection = parseRedisUrl(env.redisUrl);

const worker = new Worker(
  "reminders",
  async (job) => {
    if (job.name === "appointment-reminder") {
      const { patientEmail, startsAt } = job.data;
      await sendMail({
        to: patientEmail,
        subject: "Appointment reminder — EasyMed",
        text: `This is a reminder that you have an appointment starting at ${new Date(startsAt).toLocaleString()}.`,
      });
      logger.info("Sent appointment reminder", { jobId: job.id, patientEmail });
    }
  },
  { connection }
);

worker.on("failed", (job, err) => {
  logger.error("Reminder job failed", { jobId: job?.id, error: err.message });
});

logger.info("Reminder worker started, listening for jobs on the 'reminders' queue");
