"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const authD = (...roles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtSecret);
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden",
                });
            }
            req.user = decoded;
            next();
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }
    };
};
exports.default = authD;
