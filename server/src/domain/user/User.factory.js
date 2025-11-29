import { User } from "./User.entity.js";
import { ValidationError } from "../shared/index.js";
import argon2 from "argon2";

export const UserFactory = {
  async create(input) {
    console.log("UserFactory.create() input:", input);
    
    if (!input.userName?.trim()) throw new ValidationError("Username required");
    if (!input.email?.trim()) throw new ValidationError("Email required");
    if (!input.password || input.password.length < 8)
      throw new ValidationError("Password must be 8+ chars");

    const passwordHash = await argon2.hash(input.password);
    console.log("UserFactory - password hash created:", passwordHash ? "YES" : "NO");

    const user = new User({
      userName: input.userName.trim().toLowerCase(),
      email: input.email.trim().toLowerCase(),
      firstName: input.firstName?.trim(),
      lastName: input.lastName?.trim(),
      role: input.role || "RECEPTIONIST",
      isActive: true,
      passwordHash: passwordHash,
    });

    console.log("UserFactory - user entity created:", user);
    console.log("UserFactory - user.passwordHash:", user.passwordHash);
    
    return user;
  },

  fromSequelize(model) {
    if (!model) return null;
    const plainData = model.get({ plain: true });
    console.log("UserFactory.fromSequelize - raw data:", plainData);
    return new User(plainData);
  },
};