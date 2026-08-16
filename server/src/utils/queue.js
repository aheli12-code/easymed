import { Queue } from "bullmq";
import { env } from "../config/env.js";

function parseRedisUrl(url) {
  const u = new URL(url);
  return { host: u.hostname, port: Number(u.port || 6379) };
}

const connection = parseRedisUrl(env.redisUrl);

export const reminderQueue = new Queue("reminders", { connection });

/**
 * Schedule a reminder email to fire `delayMs` before an appointment.
 * Called from the appointment service after a successful booking.
 */
export async function scheduleAppointmentReminder({ appointmentId, patientEmail, startsAt }) {
  const reminderTime = new Date(startsAt).getTime() - 60 * 60 * 1000; // 1 hour before
  const delay = Math.max(reminderTime - Date.now(), 0);

  await reminderQueue.add(
    "appointment-reminder",
    { appointmentId, patientEmail, startsAt },
    { delay, removeOnComplete: true, removeOnFail: 100 }
  );
}
