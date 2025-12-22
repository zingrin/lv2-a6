"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingServices = void 0;
const db_1 = require("../../db");
const calculateRentDays = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime()))
        return null;
    const diff = e.getTime() - s.getTime();
    return diff / (1000 * 60 * 60 * 24);
};
const createBooking = async (payload) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;
    try {
        // 1️ check vehicle exists
        const vehicleRes = await db_1.pool.query(`SELECT * FROM vehicles WHERE id = $1`, [vehicle_id]);
        if (vehicleRes.rows.length === 0) {
            return { success: false, message: "Vehicle not found" };
        }
        const vehicle = vehicleRes.rows[0];
        if (vehicle.availability_status !== "available") {
            return { success: false, message: "Vehicle is not available" };
        }
        // 2️ calculate rent days
        const rentDays = calculateRentDays(rent_start_date, rent_end_date);
        if (!rentDays || rentDays <= 0) {
            return { success: false, message: "Invalid rent days" };
        }
        const total_price = rentDays * vehicle.daily_rent_price;
        // 3️ Insert booking
        const insertRes = await db_1.pool.query(`
      INSERT INTO bookings (
        customer_id, vehicle_id, rent_start_date, rent_end_date, total_price
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]);
        const booking = insertRes.rows[0];
        // 4️ Update vehicle status
        await db_1.pool.query(`UPDATE vehicles SET availability_status='booked' WHERE id=$1`, [vehicle_id]);
        booking.vehicle = {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price,
        };
        return {
            success: true,
            message: "Booking created successfully",
            data: booking,
        };
    }
    catch (err) {
        return { success: false, message: err.message };
    }
};
const getBookings = async (decoded) => {
    const { id: userId, role } = decoded;
    try {
        if (role === "admin") {
            const res = await db_1.pool.query(`SELECT * FROM bookings`);
            for (const b of res.rows) {
                const cus = await db_1.pool.query(`SELECT name,email FROM users WHERE id=$1`, [b.customer_id]);
                const veh = await db_1.pool.query(`SELECT vehicle_name,registration_number FROM vehicles WHERE id=$1`, [b.vehicle_id]);
                b.customer = cus.rows[0];
                b.vehicle = veh.rows[0];
            }
            return { success: true, message: "All bookings", data: res.rows };
        }
        // customer bookings
        const res = await db_1.pool.query(`
        SELECT id, vehicle_id, rent_start_date, rent_end_date, total_price, status
        FROM bookings WHERE customer_id=$1
      `, [userId]);
        for (const b of res.rows) {
            const veh = await db_1.pool.query(`SELECT vehicle_name,type,registration_number FROM vehicles WHERE id=$1`, [b.vehicle_id]);
            b.vehicle = veh.rows[0];
        }
        return { success: true, message: "Your bookings", data: res.rows };
    }
    catch (err) {
        return { success: false, message: err.message };
    }
};
const updateBooking = async (bookingId, payload, user) => {
    const { id: userId, role } = user;
    const { status } = payload;
    try {
        const res = await db_1.pool.query(`SELECT * FROM bookings WHERE id=$1`, [bookingId]);
        if (res.rows.length === 0) {
            return { success: false, message: "Booking not found" };
        }
        const booking = res.rows[0];
        // CUSTOMER CAN ONLY CANCEL BEFORE START DATE
        if (role === "customer") {
            if (status !== "cancelled")
                return { success: false, message: "Customers can only cancel booking" };
            if (booking.customer_id !== userId)
                return { success: false, message: "Not your booking" };
            if (new Date(booking.rent_start_date) <= new Date())
                return { success: false, message: "Booking already started" };
        }
        // ADMIN can mark returned or cancel
        if (role === "admin") {
            if (!["cancelled", "returned"].includes(status))
                return { success: false, message: "Invalid status" };
        }
        // UPDATE BOOKING
        const updateRes = await db_1.pool.query(`
        UPDATE bookings SET status=$2 WHERE id=$1 RETURNING *
      `, [bookingId, status]);
        // Make vehicle available again
        await db_1.pool.query(`UPDATE vehicles SET availability_status='available' WHERE id=$1`, [booking.vehicle_id]);
        return {
            success: true,
            message: `Booking ${status} successfully`,
            data: updateRes.rows[0],
        };
    }
    catch (err) {
        return { success: false, message: err.message };
    }
};
exports.bookingServices = {
    createBooking,
    getBookings,
    updateBooking,
};
