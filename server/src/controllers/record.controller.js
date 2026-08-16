import { z } from "zod";
import { recordService } from "../services/record.service.js";

const uploadSchema = z.object({
  patientId: z.string().min(1),
  type: z.enum(["history", "prescription", "diagnostic_report"]),
  title: z.string().min(2).max(200),
  notes: z.string().max(2000).optional(),
});

export const recordController = {
  async upload(req, res, next) {
    try {
      const data = uploadSchema.parse(req.body);
      const record = await recordService.upload({
        patientId: data.patientId,
        uploaderId: req.user.sub,
        type: data.type,
        title: data.title,
        notes: data.notes,
        file: req.file, // populated by multer middleware, optional
      });
      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  },

  async listForPatient(req, res, next) {
    try {
      const records = await recordService.listForPatient({
        patientId: req.params.patientId,
        requesterId: req.user.sub,
        requesterRole: req.user.role,
      });
      res.json({ records });
    } catch (err) {
      next(err);
    }
  },

  async remove(req, res, next) {
    try {
      await recordService.remove({
        recordId: req.params.recordId,
        requesterId: req.user.sub,
        requesterRole: req.user.role,
      });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
