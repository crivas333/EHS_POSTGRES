// src/domain/auth/Auth.service.js
import { User } from "../../models/index.js";
import { UserFactory } from "../user/index.js";
import { TokenService } from "./index.js";
import argon2 from "argon2";
import { ValidationError, NotFoundError } from "../shared/index.js";

export class AuthService {

  async register(input) {
  // Check for existing user
  const existingUser = await User.findOne({ 
    where: { email: input.email.toLowerCase() } 
  });
  if (existingUser) {
    throw new ValidationError("User already exists with this email");
  }

  // Create user directly - USE CAMELCASE FIELD NAMES
  const passwordHash = await argon2.hash(input.password);
  const userData = {
    firstName: input.firstName,        // ← camelCase
    lastName: input.lastName,          // ← camelCase  
    userName: input.userName,          // ← camelCase
    email: input.email.toLowerCase(),
    passwordHash: passwordHash,        // ← camelCase (model field name)
    role: input.role || "RECEPTIONIST",
    isActive: true,                    // ← camelCase
  };

  const userModel = await User.create(userData);
  const user = UserFactory.fromSequelize(userModel);
  
  return {
    user,
    accessToken: TokenService.generateAccessToken(user),
    refreshToken: TokenService.generateRefreshToken(user.id),
  };
}

async login(email, password) {
  const userModel = await User.findOne({ 
    where: { email: email.toLowerCase() } 
  });
  
  if (!userModel) {
    throw new ValidationError("Invalid credentials");
  }

  // USE CAMELCASE - Sequelize will map to snake_case via field config
  const hash = userModel.passwordHash;  // ← camelCase
  
  const valid = await argon2.verify(hash, password);
  
  if (!valid) {
    throw new ValidationError("Invalid credentials");
  }

  const user = UserFactory.fromSequelize(userModel);
  
  return {
    user,
    accessToken: TokenService.generateAccessToken(user),
    refreshToken: TokenService.generateRefreshToken(user.id),
  };
}

  async me(userId) {
    const userModel = await User.findByPk(userId);
    if (!userModel) throw new NotFoundError("User not found");
    return UserFactory.fromSequelize(userModel);
  }
}