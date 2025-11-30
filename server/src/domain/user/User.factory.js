//server/src/domain/user/User.factory.js 
import { User } from "./User.entity.js";
import { ValidationError } from "../shared/index.js";
import argon2 from "argon2";

export const UserFactory = {
  async create(input) {
    if (!input.userName?.trim()) throw new ValidationError("Username required");
    if (!input.email?.trim()) throw new ValidationError("Email required");
    if (!input.password || input.password.length < 8) {
      throw new ValidationError("Password must be 8+ chars");
    }

    const passwordHash = await argon2.hash(input.password);

    return new User({
      userName: input.userName.trim().toLowerCase(),
      email: input.email.trim().toLowerCase(),
      firstName: input.firstName?.trim(),
      lastName: input.lastName?.trim(),
      role: input.role || "RECEPTIONIST",
      isActive: true,
      passwordHash: passwordHash,
    });
  },

  fromSequelize(model) {
    if (!model) return null;
    return new User(model.get({ plain: true }));
  },
};