import { availabilityRepository } from "../repositories/availability.repository.js";
import { User } from "../models/User.js";

export const doctorService = {
  async updateProfile(doctorId, { specialization }) {
    const doctor = await User.findOneAndUpdate(
      { _id: doctorId, role: "doctor" },
      { specialization },
      { new: true }
    );
    if (!doctor) {
      const err = new Error("Doctor not found");
      err.status = 404;
      throw err;
    }
    return doctor;
  },

  async listDoctors() {
    return User.find({ role: "doctor", isActive: true }).select("name email specialization");
  },

  async getAvailability(doctorId) {
    return availabilityRepository.findByDoctor(doctorId);
  },

  async addAvailability(doctorId, slot) {
    if (slot.startTime >= slot.endTime) {
      const err = new Error("startTime must be before endTime");
      err.status = 400;
      throw err;
    }
    return availabilityRepository.create({ ...slot, doctor: doctorId });
  },

  async removeAvailability(doctorId, availabilityId) {
    const result = await availabilityRepository.deactivate(availabilityId, doctorId);
    if (!result) {
      const err = new Error("Availability slot not found");
      err.status = 404;
      throw err;
    }
    return result;
  },
};
