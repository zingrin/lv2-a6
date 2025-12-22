"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = require("express");
const authD_1 = __importDefault(require("../../middlewares/authD"));
const vehicle_controller_1 = require("./vehicle.controller");
const router = (0, express_1.Router)();
exports.vehicleRoutes = router;
router.post("/", (0, authD_1.default)("admin"), vehicle_controller_1.vehicleControllers.addVehicle);
router.get("/", vehicle_controller_1.vehicleControllers.getVehicles);
router.get("/:vehicleId", vehicle_controller_1.vehicleControllers.getVehicleById);
router.put("/:vehicleId", (0, authD_1.default)("admin"), vehicle_controller_1.vehicleControllers.updateVehicleById);
router.delete("/:vehicleId", (0, authD_1.default)("admin"), vehicle_controller_1.vehicleControllers.deleteVehicleById);
