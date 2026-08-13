import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { doctorController } from "../controllers/doctor.controller.js";

export const doctorRouter = Router();

// Any authenticated user can browse the doctor directory
doctorRouter.get("/", requireAuth, doctorController.listDoctors);

// Public-ish read of a specific doctor's availability (any authenticated user, e.g. booking)
doctorRouter.get("/:doctorId/availability", requireAuth, doctorController.getAvailability);

// Doctor-only: manage their own profile and availability
doctorRouter.patch("/me/profile", requireAuth, requireRole("doctor"), doctorController.updateProfile);
doctorRouter.get("/me/availability", requireAuth, requireRole("doctor"), doctorController.getAvailability);
doctorRouter.post("/me/availability", requireAuth, requireRole("doctor"), doctorController.addAvailability);
doctorRouter.delete(
  "/me/availability/:availabilityId",
  requireAuth,
  requireRole("doctor"),
  doctorController.removeAvailability
);
