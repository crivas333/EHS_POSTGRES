
// src/db.js
import { Pool } from "pg";
import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config({ path: "./server/src/.env" });

// Create Sequelize instance
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false, // set to console.log for debugging
});

// Create pg pool (for raw SQL queries)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

//Sync all models
// sequelize.sync({ alter: true }).then(() => {
//   console.log("Database synced!");
// });

// Utility function (keep this)
export const getNextSequenceValue = async (name) => {
  const res = await pool.query(
    `UPDATE counters SET sequence_value = sequence_value + 1
     WHERE name = $1 RETURNING sequence_value`,
    [name]
  );
  return res.rows[0].sequence_value;
};
