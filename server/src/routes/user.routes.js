import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/rbac.middleware.js";
import { userRepository } from "../repositories/user.repository.js";
import { adminController } from "../controllers/admin.controller.js";

export const userRouter = Router();

// Any authenticated user can fetch their own profile
userRouter.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await userRepository.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    next(err);
  }
});

// Admin-only user management — role-scoped middleware guards every route below
userRouter.get("/", requireAuth, requireRole("admin"), adminController.listUsers);
userRouter.patch("/:userId/active", requireAuth, requireRole("admin"), adminController.setUserActive);
userRouter.patch("/:userId/role", requireAuth, requireRole("admin"), adminController.setUserRole);
