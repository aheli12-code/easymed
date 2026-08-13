import { User } from "../models/User.js";

export const userRepository = {
  findByEmail(email) {
    return User.findOne({ email });
  },
  findById(id) {
    return User.findById(id);
  },
  create(data) {
    return User.create(data);
  },
  updateRefreshTokenHash(id, refreshTokenHash) {
    return User.findByIdAndUpdate(id, { refreshTokenHash }, { new: true });
  },
  async findMany({ role, page = 1, limit = 20 }) {
    const filter = role ? { role } : {};
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      User.find(filter).select("-passwordHash -refreshTokenHash").skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(filter),
    ]);
    return { users, total, page, limit };
  },
  setActive(id, isActive) {
    return User.findByIdAndUpdate(id, { isActive }, { new: true }).select("-passwordHash -refreshTokenHash");
  },
  setRole(id, role) {
    return User.findByIdAndUpdate(id, { role }, { new: true }).select("-passwordHash -refreshTokenHash");
  },
};
