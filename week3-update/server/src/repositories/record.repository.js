import { MedicalRecord } from "../models/MedicalRecord.js";

export const recordRepository = {
  create(data) {
    return MedicalRecord.create(data);
  },
  findForPatient(patientId) {
    return MedicalRecord.find({ patient: patientId }).sort({ createdAt: -1 });
  },
  findById(id) {
    return MedicalRecord.findById(id);
  },
  deleteById(id) {
    return MedicalRecord.findByIdAndDelete(id);
  },
};
