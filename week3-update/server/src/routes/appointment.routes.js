import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { appointmentController } from "../controllers/appointment.controller.js";

export const appointmentRouter = Router();

appointmentRouter.get("/doctors/:doctorId/slots", requireAuth, appointmentController.getSlots);
appointmentRouter.post("/", requireAuth, appointmentController.book);
appointmentRouter.get("/mine", requireAuth, appointmentController.listMine);
appointmentRouter.patch("/:appointmentId/reschedule", requireAuth, appointmentController.reschedule);
appointmentRouter.patch("/:appointmentId/cancel", requireAuth, appointmentController.cancel);
