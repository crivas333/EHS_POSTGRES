// server/src/models/user.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js"; // your Sequelize instance

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      //field: "user_id" // uncomment if DB column differs
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
    },

    // Authentication
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Virtual field: full name
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      },
    },

    // Timestamps (managed by DB)
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true, // SQL-first design, DB manages timestamps
    underscored: true, // camelCase → snake_case mapping
  }
);

export default User ;
