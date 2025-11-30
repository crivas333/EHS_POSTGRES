import { AuthService, TokenService } from "../../domain/auth/index.js";
import { GraphQLError } from "graphql";

const authService = new AuthService();

export default {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new GraphQLError("Unauthorized", { extensions: { code: "UNAUTHORIZED" } });
      
      // Return user with proper GraphQL serialization
      return {
        id: String(user.id),
        userName: user.userName,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive
      };
    },
  },

  Mutation: {
    register: async (_, { input }, { res }) => {
      const result = await authService.register(input);

      res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user: result.user,
        accessToken: result.accessToken,
        expiresIn: 900,
      };
    },

    login: async (_, { email, password }, { res }) => {
      const result = await authService.login(email, password);

      res.cookie("refresh_token", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return {
        user: result.user,
        accessToken: result.accessToken,
        expiresIn: 900,
      };
    },

    refreshToken: async (_, __, { req, res }) => {
      const token = req.cookies?.refresh_token;
      if (!token) throw new GraphQLError("No refresh token");

      try {
        const payload = TokenService.verifyRefreshToken(token);
        const user = await authService.me(payload.userId);

        const newAccessToken = TokenService.generateAccessToken(user);
        const newRefreshToken = TokenService.generateRefreshToken(user.id);

        res.cookie("refresh_token", newRefreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return { 
          user: user,
          accessToken: newAccessToken, 
          expiresIn: 900 
        };
      } catch {
        res.clearCookie("refresh_token");
        throw new GraphQLError("Invalid refresh token");
      }
    },

    logout: async (_, __, { res }) => {
      res.clearCookie("refresh_token");
      return true;
    },
  },
};