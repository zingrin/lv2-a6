"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleControllers = void 0;
const vehicle_service_1 = require("./vehicle.service");
const addVehicle = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleServices.addVehicle(req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(201).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getVehicles = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleServices.getVehicles();
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const getVehicleById = async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicle_service_1.vehicleServices.getVehicleId(Number(vehicleId));
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const updateVehicleById = async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicle_service_1.vehicleServices.updateVehicleId(Number(vehicleId), req.body);
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const deleteVehicleById = async (req, res) => {
    const { vehicleId } = req.params;
    try {
        const result = await vehicle_service_1.vehicleServices.deleteVehicleId(Number(vehicleId));
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.vehicleControllers = {
    addVehicle,
    getVehicles,
    getVehicleById,
    updateVehicleById,
    deleteVehicleById,
};
