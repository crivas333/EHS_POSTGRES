import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production-2025";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh-secret-2025";

export const TokenService = {
  generateAccessToken(user) {
    return jwt.sign(
      { userId: user.id, role: user.role, userName: user.userName },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
  },

  generateRefreshToken(userId) {
    return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
  },

  verifyAccessToken(token) {
    return jwt.verify(token, JWT_SECRET);
  },

  verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_SECRET);
  },
};