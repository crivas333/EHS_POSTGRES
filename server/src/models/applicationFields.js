// server/src/models/applicationFields.js
import { DataTypes } from "sequelize";
import { sequelize } from "../db.js"; // your Sequelize instance

// Define the model
const ApplicationFields = sequelize.define(
  "ApplicationFields",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fieldView: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "field_view", // maps JS camelCase -> DB lowercase
    },
    fieldType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "field_type",
    },
    fieldData: {
      type: DataTypes.STRING, // or DataTypes.TEXT if not JSON
      allowNull: false,
      field: "field_data",
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
  },
  {
    tableName: "application_fields",
    timestamps: true, // manages createdAt/updatedAt automatically
    underscored: true,
  }
);
export { ApplicationFields };
// Sequelize CRUD methods

export const getAllFields = async () => {
  return await ApplicationFields.findAll({
    order: [["id", "ASC"]],
  });
};

export const createField = async ({ fieldView, fieldType, fieldData }) => {
  return await ApplicationFields.create({ fieldView, fieldType, fieldData });
};

export const updateField = async (id, fieldData) => {
  const field = await ApplicationFields.findByPk(id);
  if (!field) return null;

  field.fieldData = fieldData;
  await field.save();
  return field;
};

export const deleteField = async (id) => {
  const field = await ApplicationFields.findByPk(id);
  if (!field) return false;

  await field.destroy();
  return true;
};
