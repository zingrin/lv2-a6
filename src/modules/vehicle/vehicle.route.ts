import { Router } from "express";
import authD from "../../middlewares/authD";
import { vehicleControllers } from "./vehicle.controller";

const router = Router();

router.post("/", authD("admin"), vehicleControllers.addVehicle);

router.get("/", vehicleControllers.getVehicles);

router.get("/:vehicleId", vehicleControllers.getVehicleById);

router.put(
  "/:vehicleId",
  authD("admin"),
  vehicleControllers.updateVehicleById
);

router.delete(
  "/:vehicleId",
  authD("admin"),
  vehicleControllers.deleteVehicleById
);

export { router as vehicleRoutes };