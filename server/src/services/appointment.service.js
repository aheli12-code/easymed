import { appointmentRepository } from "../repositories/appointment.repository.js";
import { availabilityRepository } from "../repositories/availability.repository.js";

/**
 * All times are handled as UTC ISO strings/Date objects end-to-end. The
 * client is responsible for converting to/from the user's local timezone
 * for display (FullCalendar handles this natively).
 */

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export const appointmentService = {
  /**
   * Generate bookable slots for a doctor over the next `days` days,
   * derived from their recurring weekly availability, minus already-booked
   * appointments.
   */
  async getAvailableSlots(doctorId, days = 14) {
    const weeklyAvailability = await availabilityRepository.findByDoctor(doctorId);
    if (!weeklyAvailability.length) return [];

    const now = new Date();
    const rangeEnd = addMinutes(now, days * 24 * 60);

    // Pull all booked/rescheduled appointments for this doctor in range
    const booked = await appointmentRepository.findForUser(doctorId, "doctor");
    const bookedRanges = booked
      .filter((a) => ["booked", "rescheduled"].includes(a.status))
      .map((a) => ({ start: a.startsAt.getTime(), end: a.endsAt.getTime() }));

    const slots = [];
    for (let d = new Date(now); d <= rangeEnd; d = addMinutes(d, 24 * 60)) {
      const dayOfWeek = d.getUTCDay();
      const dayAvailability = weeklyAvailability.filter((a) => a.dayOfWeek === dayOfWeek);

      for (const avail of dayAvailability) {
        const [startH, startM] = avail.startTime.split(":").map(Number);
        const [endH, endM] = avail.endTime.split(":").map(Number);

        let slotStart = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), startH, startM));
        const dayEnd = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), endH, endM));

        while (addMinutes(slotStart, avail.slotDurationMinutes) <= dayEnd) {
          const slotEnd = addMinutes(slotStart, avail.slotDurationMinutes);
          const isPast = slotStart < now;
          const overlapsBooked = bookedRanges.some(
            (b) => slotStart.getTime() < b.end && slotEnd.getTime() > b.start
          );
          if (!isPast && !overlapsBooked) {
            slots.push({ startsAt: slotStart.toISOString(), endsAt: slotEnd.toISOString() });
          }
          slotStart = slotEnd;
        }
      }
    }

    return slots.sort((a, b) => new Date(a.startsAt) - new Date(b.startsAt));
  },

  async book({ patientId, doctorId, startsAt, endsAt, reason }) {
    const start = new Date(startsAt);
    const end = new Date(endsAt);

    if (start >= end) {
      const err = new Error("startsAt must be before endsAt");
      err.status = 400;
      throw err;
    }
    if (start < new Date()) {
      const err = new Error("Cannot book an appointment in the past");
      err.status = 400;
      throw err;
    }

    const conflict = await appointmentRepository.findOverlapping(doctorId, start, end);
    if (conflict) {
      const err = new Error("This time slot is no longer available");
      err.status = 409;
      throw err;
    }

    return appointmentRepository.create({
      patient: patientId,
      doctor: doctorId,
      startsAt: start,
      endsAt: end,
      reason,
    });
  },

  async reschedule({ appointmentId, requesterId, newStartsAt, newEndsAt }) {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      const err = new Error("Appointment not found");
      err.status = 404;
      throw err;
    }
    const isParticipant =
      String(appointment.patient) === String(requesterId) ||
      String(appointment.doctor) === String(requesterId);
    if (!isParticipant) {
      const err = new Error("Not authorized to modify this appointment");
      err.status = 403;
      throw err;
    }

    const start = new Date(newStartsAt);
    const end = new Date(newEndsAt);
    const conflict = await appointmentRepository.findOverlapping(
      appointment.doctor,
      start,
      end,
      appointmentId
    );
    if (conflict) {
      const err = new Error("This time slot is no longer available");
      err.status = 409;
      throw err;
    }

    return appointmentRepository.reschedule(appointmentId, start, end);
  },

  async cancel({ appointmentId, requesterId }) {
    const appointment = await appointmentRepository.findById(appointmentId);
    if (!appointment) {
      const err = new Error("Appointment not found");
      err.status = 404;
      throw err;
    }
    const isParticipant =
      String(appointment.patient) === String(requesterId) ||
      String(appointment.doctor) === String(requesterId);
    if (!isParticipant) {
      const err = new Error("Not authorized to modify this appointment");
      err.status = 403;
      throw err;
    }
    return appointmentRepository.updateStatus(appointmentId, "cancelled");
  },

  listForUser(userId, role) {
    return appointmentRepository.findForUser(userId, role);
  },
};
