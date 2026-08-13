import { z } from "zod";
import { userRepository } from "../repositories/user.repository.js";

const listQuerySchema = z.object({
  role: z.enum(["patient", "doctor", "admin"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

const setActiveSchema = z.object({
  isActive: z.boolean(),
});

const setRoleSchema = z.object({
  role: z.enum(["patient", "doctor", "admin"]),
});

export const adminController = {
  async listUsers(req, res, next) {
    try {
      const query = listQuerySchema.parse(req.query);
      const result = await userRepository.findMany(query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  async setUserActive(req, res, next) {
    try {
      const { isActive } = setActiveSchema.parse(req.body);
      const user = await userRepository.setActive(req.params.userId, isActive);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },

  async setUserRole(req, res, next) {
    try {
      const { role } = setRoleSchema.parse(req.body);
      // Prevent an admin from demoting themselves out of admin by accident
      if (req.params.userId === req.user.sub && role !== "admin") {
        return res.status(400).json({ message: "Cannot change your own admin role" });
      }
      const user = await userRepository.setRole(req.params.userId, role);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};
