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

    // Create user directly - simplified approach
    const passwordHash = await argon2.hash(input.password);
    const userData = {
      first_name: input.firstName,
      last_name: input.lastName,
      user_name: input.userName,
      email: input.email.toLowerCase(),
      password_hash: passwordHash,
      role: input.role || "RECEPTIONIST",
      is_active: true,
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

    const hash = userModel.password_hash;
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