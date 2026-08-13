import { z } from "zod";
import { doctorService } from "../services/doctor.service.js";

const profileSchema = z.object({
  specialization: z.string().min(2).max(100),
});

const availabilitySchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM 24h format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Use HH:MM 24h format"),
  slotDurationMinutes: z.number().int().positive().default(30),
});

export const doctorController = {
  async listDoctors(req, res, next) {
    try {
      const doctors = await doctorService.listDoctors();
      res.json({ doctors });
    } catch (err) {
      next(err);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const data = profileSchema.parse(req.body);
      const doctor = await doctorService.updateProfile(req.user.sub, data);
      res.json({
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
      });
    } catch (err) {
      next(err);
    }
  },

  async getAvailability(req, res, next) {
    try {
      const doctorId = req.params.doctorId || req.user.sub;
      const slots = await doctorService.getAvailability(doctorId);
      res.json({ slots });
    } catch (err) {
      next(err);
    }
  },

  async addAvailability(req, res, next) {
    try {
      const data = availabilitySchema.parse(req.body);
      const slot = await doctorService.addAvailability(req.user.sub, data);
      res.status(201).json(slot);
    } catch (err) {
      next(err);
    }
  },

  async removeAvailability(req, res, next) {
    try {
      await doctorService.removeAvailability(req.user.sub, req.params.availabilityId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
