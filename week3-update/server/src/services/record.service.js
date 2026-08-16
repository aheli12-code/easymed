import { recordRepository } from "../repositories/record.repository.js";
import fs from "fs";

export const recordService = {
  async upload({ patientId, uploaderId, type, title, notes, file }) {
    return recordRepository.create({
      patient: patientId,
      uploadedBy: uploaderId,
      type,
      title,
      notes,
      fileUrl: file ? `/uploads/${file.filename}` : null,
      fileKey: file ? file.filename : null,
      mimeType: file ? file.mimetype : null,
    });
  },

  async listForPatient({ patientId, requesterId, requesterRole }) {
    // Patients can only view their own records; doctors/admins can view any
    // patient's records (in a real deployment, doctors should be scoped to
    // patients they have an active appointment/care relationship with).
    if (requesterRole === "patient" && String(patientId) !== String(requesterId)) {
      const err = new Error("Not authorized to view these records");
      err.status = 403;
      throw err;
    }
    return recordRepository.findForPatient(patientId);
  },

  async remove({ recordId, requesterId, requesterRole }) {
    const record = await recordRepository.findById(recordId);
    if (!record) {
      const err = new Error("Record not found");
      err.status = 404;
      throw err;
    }
    const isOwner = String(record.patient) === String(requesterId);
    const isUploader = String(record.uploadedBy) === String(requesterId);
    if (requesterRole !== "admin" && !isOwner && !isUploader) {
      const err = new Error("Not authorized to delete this record");
      err.status = 403;
      throw err;
    }
    if (record.fileKey) {
      fs.unlink(`uploads/${record.fileKey}`, () => {}); // best-effort cleanup
    }
    await recordRepository.deleteById(recordId);
  },
};
