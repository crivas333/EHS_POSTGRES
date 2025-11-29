// src/domain/auth/Auth.service.js
import { GraphQLError } from "graphql";
import { User } from "../../models/index.js";
import { UserFactory } from "../user/index.js";
import { TokenService } from "./index.js";
import argon2 from "argon2";
import { ValidationError, NotFoundError } from "../shared/index.js";

export class AuthService {
  async register(input) {
    console.log("=== REGISTRATION DEBUG ===");
    console.log("1. Registration input received:", JSON.stringify(input, null, 2));
    
    const userEntity = await UserFactory.create(input);
    console.log("2. User entity created:", JSON.stringify(userEntity, null, 2));
    
    // Convert to plain object with proper field names for Sequelize
    const userData = userEntity.toJSON();
    console.log("3. User data for Sequelize (toJSON output):", JSON.stringify(userData, null, 2));
    console.log("3b. Checking password fields:");
  console.log("   - password_hash in userData:", userData.password_hash);
  console.log("   - passwordHash in userData:", userData.passwordHash);
  console.log("   - All keys in userData:", Object.keys(userData));


    console.log("4. Attempting to create user in database...");

    
    try {
      const userModel = await User.create(userData);
      console.log("5. User created successfully in database:", JSON.stringify(userModel.get({ plain: true }), null, 2));
      console.log("5b. Created user data:", userModel.get({ plain: true }));
      
      const user = UserFactory.fromSequelize(userModel);
      console.log("6. Final user object for response:", JSON.stringify(user, null, 2));
      
      const accessToken = TokenService.generateAccessToken(user);
      const refreshToken = TokenService.generateRefreshToken(user.id);
      
      console.log("7. Tokens generated successfully");
      console.log("=== REGISTRATION COMPLETE ===");
      
      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error("!!! DATABASE CREATION ERROR:", error);
      console.error("Error details:", error.errors);
      throw error;
    }
  }

  async login(email, password) {
    console.log("=== LOGIN DEBUG ===");
    console.log("Login attempt for email:", email);
    
    const userModel = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (!userModel) {
      console.log("Login failed: User not found");
      throw new ValidationError("Invalid credentials");
    }

    console.log("User found in database:", userModel.get({ plain: true }));
    
    const hash = userModel.password_hash || userModel.getDataValue("password_hash");
    
    if (!hash) {
      console.log("Login failed: No password hash found");
      throw new ValidationError("Invalid credentials");
    }

    const valid = await argon2.verify(hash, password);
    if (!valid) {
      console.log("Login failed: Password verification failed");
      throw new ValidationError("Invalid credentials");
    }

    const user = UserFactory.fromSequelize(userModel);
    const accessToken = TokenService.generateAccessToken(user);
    const refreshToken = TokenService.generateRefreshToken(user.id);

    console.log("Login successful for user:", user.email);
    console.log("=== LOGIN COMPLETE ===");
    
    return { user, accessToken, refreshToken };
  }

  async me(userId) {
    console.log("=== ME QUERY DEBUG ===");
    console.log("Fetching user with ID:", userId);
    
    const userModel = await User.findByPk(userId);
    if (!userModel) {
      console.log("User not found with ID:", userId);
      throw new NotFoundError("User not found");
    }
    
    const user = UserFactory.fromSequelize(userModel);
    console.log("User found:", user.email);
    console.log("=== ME QUERY COMPLETE ===");
    
    return user;
  }
}