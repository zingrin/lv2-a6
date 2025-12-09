import express, {  json, Request, Response } from "express";
import initDB from "./db";
import { userRoutes } from "./modules/user/user.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.route";
import { bookingRoutes } from "./modules/booking/booking.route";

const app = express();

app.use(json());

// Initialize DB
initDB();

//* Auth Routes
app.use("/api/v1/auth", authRoutes);  

//* User Routes
app.use("/api/v1/users", userRoutes); 
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/bookings", bookingRoutes);
//* Not Found Route Handler
// app.use((req: Request, res: Response) => {
//   return res.status(404).json({
//     success: false,
//     message: "404 Route not found",
//     route: req.url,
//     path: req.path,
//     url: req.originalUrl,
//   });
// });

export default app;
