//server/src/models/user.js 
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Names
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "first_name",
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "last_name",
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "user_name",
    },

    // Contact
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    // Authentication
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },

    // Role
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "RECEPTIONIST",
      validate: {
        isIn: [["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACY", "LAB"]],
      },
    },

    // Status
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",
    },

    // Virtuals
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`.trim();
      },
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,    // Let Sequelize handle createdAt/updatedAt
    underscored: true,   // Automatically maps camelCase to snake_case
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["user_name"] },
    ],
  }
);

export default User;