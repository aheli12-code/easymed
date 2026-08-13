import { Availability } from "../models/Availability.js";

export const availabilityRepository = {
  findByDoctor(doctorId) {
    return Availability.find({ doctor: doctorId, isActive: true }).sort({ dayOfWeek: 1 });
  },
  create(data) {
    return Availability.create(data);
  },
  updateById(id, doctorId, data) {
    return Availability.findOneAndUpdate({ _id: id, doctor: doctorId }, data, { new: true });
  },
  deactivate(id, doctorId) {
    return Availability.findOneAndUpdate(
      { _id: id, doctor: doctorId },
      { isActive: false },
      { new: true }
    );
  },
};
