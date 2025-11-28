// server/src/models/user.js
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
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },

    // Role — matches DB default 'RECEPTIONIST'
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "RECEPTIONIST",
      field: "role",
      validate: {
        isIn: [["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "PHARMACY", "LAB"]],
      },
    },

    // Status — matches DB column name
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "is_active",   // ← THIS IS THE KEY CHANGE
    },

    // Virtuals
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`.trim();
      },
    },

    // Timestamps
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ["email"] },
      { unique: true, fields: ["user_name"] },
    ],
  }
);

export default User;