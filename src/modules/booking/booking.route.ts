import { Router } from "express";
import { bookingControllers } from "./booking.controller";
import authD from "../../middlewares/authD";

const router = Router();

router.post(
  "/",
  authD("admin", "customer"),
  bookingControllers.createBooking
);

router.get(
  "/",
  authD("admin", "customer"),
  bookingControllers.getBookings
);

router.put(
  "/:bookingId",
  authD("admin", "customer"),
  bookingControllers.updateBooking
);

export { router as bookingRoutes };