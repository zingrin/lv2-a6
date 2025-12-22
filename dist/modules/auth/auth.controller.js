"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const auth_service_1 = require("./auth.service");
const handleSignup = async (req, res) => {
    try {
        const result = await auth_service_1.authServices.handleSignup(req.body);
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
const handleSignin = async (req, res) => {
    const { email, password } = req.body;
    // console.log(req.body);
    try {
        const result = await auth_service_1.authServices.handleSignin(email, password);
        // console.log(result);
        if (!result.success) {
            return res.status(400).json(result);
        }
        return res.status(200).json(result);
    }
    catch (error) {
        // console.log("error");
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
exports.authControllers = {
    handleSignup,
    handleSignin,
};
