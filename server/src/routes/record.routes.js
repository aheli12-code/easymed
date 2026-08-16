import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { recordController } from "../controllers/record.controller.js";

export const recordRouter = Router();

recordRouter.post("/", requireAuth, upload.single("file"), recordController.upload);
recordRouter.get("/patient/:patientId", requireAuth, recordController.listForPatient);
recordRouter.delete("/:recordId", requireAuth, recordController.remove);
