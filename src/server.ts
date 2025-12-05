import express, { Request, Response } from "express";
import config from "./config";
import initDB, { pool } from "./db";

const app = express();
app.use(express.json());
initDB();


// Create User
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password, phone, role } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, password, phone, role)
       VALUES($1, LOWER($2), $3, $4, $5)
       RETURNING *`,
      [name, email, password, phone, role]
    );

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get All Users
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users`);

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Single User
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update User
app.put("/users/:id", async (req: Request, res: Response) => {
  const { name, email, phone, role } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=LOWER($2), phone=$3, role=$4 WHERE id=$5 RETURNING *`,
      [name, email, phone, role, req.params.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated", data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete User
app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM users WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Create Vehicle
app.post("/vehicles", async (req: Request, res: Response) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status)
       VALUES($1, $2, $3, $4, $5) RETURNING *`,
      [vehicle_name, type, registration_number, daily_rent_price, availability_status]
    );

    res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get All Vehicles
app.get("/vehicles", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles`);

    res.json({ success: true, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Single Vehicle
app.get("/vehicles/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update Vehicle
app.put("/vehicles/:id", async (req: Request, res: Response) => {
  const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

  try {
    const result = await pool.query(
      `UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 
       WHERE id=$6 RETURNING *`,
      [
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.json({ success: true, message: "Vehicle updated", data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Vehicle
app.delete("/vehicles/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Vehicle not found" });

    res.json({ success: true, message: "Vehicle deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// Create Booking
app.post("/bookings", async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]
    );

    res.status(201).json({
      success: true,
      message: "Booking created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get All Bookings
app.get("/bookings", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM bookings`);
    res.json({ success: true, data: result.rows });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Single Booking
app.get("/bookings/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, data: result.rows[0] });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete Booking
app.delete("/bookings/:id", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`DELETE FROM bookings WHERE id=$1`, [
      req.params.id,
    ]);

    if (result.rowCount === 0)
      return res.status(404).json({ success: false, message: "Booking not found" });

    res.json({ success: true, message: "Booking deleted" });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});


app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
