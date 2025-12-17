import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { bookingServices } from "./booking.service";

const getUser = (req: Request) => req.user as JwtPayload | undefined;

const createBooking = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
console.log(user);
    if (!user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid user token",
      });
    }

    const result = await bookingServices.createBooking(req.body);

    return res.status(result.success ? 201 : 400).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  try {
    const user = getUser(req);

    if (!user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid user token",
      });
    }

    const result = await bookingServices.getBookings(user);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
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

    const result = await bookingServices.updateBooking(bookingId, updates, user);

    return res.status(result.success ? 200 : 400).json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookingControllers = {
  createBooking,
  getBookings,
  updateBooking,
}; 