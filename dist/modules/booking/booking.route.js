"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const booking_controller_1 = require("./booking.controller");
const authD_1 = __importDefault(require("../../middlewares/authD"));
const router = (0, express_1.Router)();
exports.bookingRoutes = router;
router.post("/", (0, authD_1.default)("admin", "customer"), booking_controller_1.bookingControllers.createBooking);
router.get("/", (0, authD_1.default)("admin", "customer"), booking_controller_1.bookingControllers.getBookings);
router.put("/:bookingId", (0, authD_1.default)("admin", "customer"), booking_controller_1.bookingControllers.updateBooking);
