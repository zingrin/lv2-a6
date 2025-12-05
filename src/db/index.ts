import { Pool } from "pg";
import config from "../config";

export const pool = new Pool({
  connectionString: config.connection_str,
});

const initDB = async () => {
  try {
    console.log(" Initializing database...");

    // USERS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'customer',
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log(" users table ready");

    // VEHICLES TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        type VARCHAR(100) NOT NULL,
        model VARCHAR(150),
        price_per_day NUMERIC(10,2) NOT NULL,
        available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log(" vehicles table ready");

    // BOOKINGS TABLE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        total_amount NUMERIC(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log(" bookings table ready");

    console.log(" Database initialized successfully!");
  } catch (error) {
    console.error(" Database initialization failed:", error);
  }
};

export default initDB;
