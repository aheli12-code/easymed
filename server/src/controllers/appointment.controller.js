import { z } from "zod";
import { appointmentService } from "../services/appointment.service.js";
import { scheduleAppointmentReminder } from "../utils/queue.js";
import { userRepository } from "../repositories/user.repository.js";

const bookSchema = z.object({
  doctorId: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  reason: z.string().max(500).optional(),
});

const rescheduleSchema = z.object({
  newStartsAt: z.string().datetime(),
  newEndsAt: z.string().datetime(),
});

export const appointmentController = {
  async getSlots(req, res, next) {
    try {
      const days = req.query.days ? Number(req.query.days) : 14;
      const slots = await appointmentService.getAvailableSlots(req.params.doctorId, days);
      res.json({ slots });
    } catch (err) {
      next(err);
    }
  },

  async book(req, res, next) {
    try {
      const data = bookSchema.parse(req.body);
      const appointment = await appointmentService.book({
        patientId: req.user.sub,
        doctorId: data.doctorId,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        reason: data.reason,
      });

      // Real-time notification to the doctor (Week 3: Socket.io notifications)
      const io = req.app.get("io");
      io?.to(`user:${data.doctorId}`).emit("notification", {
        type: "appointment_booked",
        appointmentId: appointment._id,
        startsAt: appointment.startsAt,
      });

      // Async reminder email via BullMQ (Week 3: background job queue)
      const patient = await userRepository.findById(req.user.sub);
      if (patient?.email) {
        await scheduleAppointmentReminder({
          appointmentId: appointment._id,
          patientEmail: patient.email,
          startsAt: appointment.startsAt,
        });
      }

      res.status(201).json(appointment);
    } catch (err) {
      next(err);
    }
  },

  async listMine(req, res, next) {
    try {
      const appointments = await appointmentService.listForUser(req.user.sub, req.user.role);
      res.json({ appointments });
    } catch (err) {
      next(err);
    }
  },

  async reschedule(req, res, next) {
    try {
      const data = rescheduleSchema.parse(req.body);
      const appointment = await appointmentService.reschedule({
        appointmentId: req.params.appointmentId,
        requesterId: req.user.sub,
        newStartsAt: data.newStartsAt,
        newEndsAt: data.newEndsAt,
      });

      const io = req.app.get("io");
      const notifyId =
        String(req.user.sub) === String(appointment.doctor) ? appointment.patient : appointment.doctor;
      io?.to(`user:${notifyId}`).emit("notification", {
        type: "appointment_rescheduled",
        appointmentId: appointment._id,
        startsAt: appointment.startsAt,
      });

      res.json(appointment);
    } catch (err) {
      next(err);
    }
  },

  async cancel(req, res, next) {
    try {
      const appointment = await appointmentService.cancel({
        appointmentId: req.params.appointmentId,
        requesterId: req.user.sub,
      });

      const io = req.app.get("io");
      const notifyId =
        String(req.user.sub) === String(appointment.doctor) ? appointment.patient : appointment.doctor;
      io?.to(`user:${notifyId}`).emit("notification", {
        type: "appointment_cancelled",
        appointmentId: appointment._id,
      });

      res.json(appointment);
    } catch (err) {
      next(err);
    }
  },
};
