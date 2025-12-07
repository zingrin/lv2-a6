import { Router } from "express";
import authD from "../../middlewares/auth";
import { userControllers } from "./users.controller";

const router = Router();

router.get("/", authD("admin"), userControllers.getUsers);

router.put(
  "/:userId",
  authD("admin", "customer"),
  userControllers.updateUser
);

router.delete("/:userId", authD("admin"), userControllers.deleteUser);

export const userRoutes = router;