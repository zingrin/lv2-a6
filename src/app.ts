import express, { json, Request, Response } from "express";
import initDB from "./db";
import { userRoutes } from "./modules/users/users.routes";

//* Create Express application
const app = express();

//* Middleware to parse JSON requests
app.use(json());

//* Initialize Database
initDB();


//* User Routes
app.use("/api/v1/users", userRoutes);

//* Not Found Route Handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "404 Route not found",
    route: req.url,
    path: req.path,
    url: req.originalUrl,
  });
});

export default app;
