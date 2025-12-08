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
      CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password VARCHAR(200) NOT NULL,
          phone VARCHAR(20) NOT NULL,
          role VARCHAR(20) DEFAULT 'customer'
            CHECK(role IN ('admin', 'customer'))
      );
    `);
    console.log(" users table ready");

    // VEHICLES TABLE
    await pool.query(`
     CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      vehicle_name VARCHAR(100) NOT NULL,
      type VARCHAR(100) NOT NULL,
      registration_number VARCHAR(200) NOT NULL UNIQUE,
      daily_rent_price INTEGER NOT NULL
        CHECK(daily_rent_price > 0),
      availability_status VARCHAR(20) DEFAULT 'available'
        CHECK(availability_status IN ('available', 'booked'))
  
    );
    `);
    console.log(" vehicles table ready");

    // BOOKINGS TABLE
    await pool.query(`
     CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          customer_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          vehicle_id INT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
          rent_start_date DATE NOT NULL,
          rent_end_date DATE NOT NULL,
          total_price INTEGER NOT NULL 
            CHECK(total_price > 0),
          status VARCHAR(20) DEFAULT 'active'
            CHECK(status IN ('active', 'cancelled', 'returned')),

          CHECK (rent_end_date > rent_start_date)
      );
    `);
    console.log(" bookings table ready");

    console.log(" Database initialized successfully!");
  } catch (error) {
    console.error(" Database initialization failed:", error);
  }
};

export default initDB;
