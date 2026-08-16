import { Appointment } from "../models/Appointment.js";

export const appointmentRepository = {
  findOverlapping(doctorId, startsAt, endsAt, excludeId = null) {
    const filter = {
      doctor: doctorId,
      status: { $in: ["booked", "rescheduled"] },
      // Overlap test: existing.start < new.end AND existing.end > new.start
      startsAt: { $lt: endsAt },
      endsAt: { $gt: startsAt },
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return Appointment.findOne(filter);
  },

  create(data) {
    return Appointment.create(data);
  },

  findById(id) {
    return Appointment.findById(id);
  },

  findForUser(userId, role) {
    const filter = role === "doctor" ? { doctor: userId } : { patient: userId };
    return Appointment.find(filter)
      .sort({ startsAt: 1 })
      .populate("patient", "name email")
      .populate("doctor", "name email specialization");
  },

  updateStatus(id, status) {
    return Appointment.findByIdAndUpdate(id, { status }, { new: true });
  },

  reschedule(id, startsAt, endsAt) {
    return Appointment.findByIdAndUpdate(
      id,
      { startsAt, endsAt, status: "rescheduled" },
      { new: true }
    );
  },
};
