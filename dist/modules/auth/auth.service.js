"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../../db");
const config_1 = __importDefault(require("../../config"));
const handleSignup = async (payload) => {
    const { name, email, password, phone, role } = payload;
    try {
        const existingUser = await db_1.pool.query(`
        SELECT *
        FROM users
        WHERE email = $1
      `, [email]);
        if (existingUser.rows.length > 0) {
            return {
                success: false,
                message: "user already exists",
            };
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const result = await db_1.pool.query(`
        INSERT INTO users (
            name,
            email,
            password,
            phone,
            role
          )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, name, email, phone, role;
      `, [name, email, hashedPassword, phone, role]);
        return {
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Registration failed",
        };
    }
};
const handleSignin = async (email, password) => {
    try {
        const result = await db_1.pool.query(`
        SELECT *
        FROM users
        WHERE email = $1
      `, [email]);
        // console.log(result);
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "User Not Exist",
            };
        }
        const user = result.rows[0];
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid password",
            };
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, config_1.default.jwtSecret, {
            expiresIn: "7d",
        });
        return {
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                },
            },
        };
    }
    catch (error) {
        return {
            success: false,
            message: "Login failed",
        };
    }
};
exports.authServices = {
    handleSignup,
    handleSignin,
};
