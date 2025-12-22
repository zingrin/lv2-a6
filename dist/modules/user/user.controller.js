"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
const getUsers = async (req, res) => {
    try {
        const result = await user_service_1.userServices.getUsers();
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
const updateUser = async (req, res) => {
    const { userId } = req.params;
    const user = req.user;
    const payload = req.body;
    try {
        const result = await user_service_1.userServices.updateUser(Number(userId), user, payload);
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
const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const result = await user_service_1.userServices.deleteUser(Number(userId));
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
exports.userControllers = {
    getUsers,
    updateUser,
    deleteUser,
};
