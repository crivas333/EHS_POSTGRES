// src/domain/auth/Auth.service.js
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";

import { User } from "../../models/index.js";
import { UserFactory } from "../user/index.js";           // ← works!
import { TokenService } from "./index.js";                 // ← or "./token.service.js"
import argon2 from "argon2";
import { ValidationError, NotFoundError } from "../shared/index.js"; // ← works!

// ← REMOVE "default" from the class
export class AuthService {

async register(input) {
  const userEntity = await UserFactory.create(input);

  // THIS IS THE WINNING LINE — toJSON() converts to plain object!
  const userModel = await User.create(userEntity.toJSON());

  const user = UserFactory.fromSequelize(userModel);
  const accessToken = TokenService.generateAccessToken(user);
  const refreshToken = TokenService.generateRefreshToken(user.id);

  return { user, accessToken, refreshToken };
}

// src/domain/auth/Auth.service.js → login method (FINAL VERSION)
async login(email, password) {
  try {
    const userModel = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (!userModel || !userModel.password_hash) {
      throw new ValidationError("Invalid credentials");
    }

    const hash = userModel.password_hash;
    let valid = false;

    if (hash.startsWith("$2")) {
      valid = await bcrypt.compare(password, hash);
    } else if (hash.startsWith("$argon2")) {
      valid = await argon2.verify(hash, password);
    }

    if (!valid) {
      throw new ValidationError("Invalid credentials");
    }

    // SUCCESS — upgrade bcrypt → argon2 on login (optional but elite)
    if (hash.startsWith("$2")) {
      userModel.password_hash = await argon2.hash(password);
      await userModel.save();
      console.log(`Upgraded password hash to argon2 for ${email}`);
    }

    const user = UserFactory.fromSequelize(userModel);
    const accessToken = TokenService.generateAccessToken(user);
    const refreshToken = TokenService.generateRefreshToken(user.id);

    return { user, accessToken, refreshToken };

  } catch (err) {
    // THIS IS THE KEY — re-throw as GraphQL-friendly error
    if (err instanceof ValidationError) {
      throw new GraphQLError(err.message, {
        extensions: { code: "UNAUTHORIZED" }
      });
    }
    throw err;
  }
}

  async me(userId) {
    const userModel = await User.findByPk(userId);
    if (!userModel) throw new NotFoundError("User not found");
    return UserFactory.fromSequelize(userModel);
  }
}

// ← REMOVE the "default new AuthService()" line entirely!
// We now export the CLASS, not an instance