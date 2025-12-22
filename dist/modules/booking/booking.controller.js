"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingControllers = void 0;
const booking_service_1 = require("./booking.service");
const getUser = (req) => req.user;
const createBooking = async (req, res) => {
    try {
        const user = req.user;
        // console.log(user);
        if (!user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid user token",
            });
        }
        const result = await booking_service_1.bookingServices.createBooking(req.body);
        return res.status(result.success ? 201 : 400).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getBookings = async (req, res) => {
    try {
        const user = getUser(req);
        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid user token",
            });
        }
        const result = await booking_service_1.bookingServices.getBookings(user);
        return res.status(result.success ? 200 : 400).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const updateBooking = async (req, res) => {
    try {
        const user = getUser(req);
        const bookingId = Number(req.params.bookingId);
        const updates = req.body;
        if (!user?.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid user token",
            });
        }
        if (isNaN(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID",
            });
        }
        const result = await booking_service_1.bookingServices.updateBooking(bookingId, updates, user);
        return res.status(result.success ? 200 : 400).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.bookingControllers = {
    createBooking,
    getBookings,
    updateBooking,
};
