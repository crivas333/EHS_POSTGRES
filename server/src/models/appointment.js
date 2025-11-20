import { DataTypes } from "sequelize";
import {sequelize} from "../db.js";

const Appointment = sequelize.define(
  "Appointment",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      field: "patient_id",
      allowNull: true,
      // references: {
      //   model: "patient",
      //   key: "id",
      // },
    },
    notRegistered: {
      type: DataTypes.STRING(155),
      allowNull: true,
      field: "not_registered",
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    arriveTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "arrive_time",
    },
    
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updated_at",
    },
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
    underscored: true, // maps camelCase attributes to snake_case DB columns automatically
  }
);

export default Appointment;

