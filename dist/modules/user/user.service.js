"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const db_1 = require("../../db");
const getUsers = async () => {
    try {
        const result = await db_1.pool.query(`
        SELECT id, name, email, phone, role FROM users
      `);
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "No users found",
                data: [],
            };
        }
        return {
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
const updateUser = async (userId, user, payload) => {
    const { name, email, phone, role } = payload;
    try {
        const dbResult = await db_1.pool.query(`
        SELECT email
        FROM users
        WHERE id = $1
      `, [userId]);
        if (dbResult.rows.length === 0) {
            return {
                success: false,
                message: "User not found",
            };
        }
        const dbUser = dbResult.rows[0];
        console.log({ dbUser });
        const isValidUser = user && (user.role === "admin" || user.email === dbUser.email);
        if (!isValidUser) {
            return {
                success: false,
                message: "You are not authorized to update this user",
            };
        }
        const result = await db_1.pool.query(`
        UPDATE users
        SET
          name = $2,
          email = $3,
          phone = $4,
          role = $5
        WHERE id = $1
        RETURNING id, name, email, phone, role
      `, [userId, name, email, phone, role]);
        return {
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
const deleteUser = async (userId) => {
    try {
        const result = await db_1.pool.query(`
        DELETE FROM users
        WHERE id = $1
        RETURNING id
      `, [userId]);
        if (result.rows.length === 0) {
            return {
                success: false,
                message: "User not found",
            };
        }
        return {
            success: true,
            message: "User deleted successfully",
        };
    }
    catch (error) {
        return {
            success: false,
            message: error.message,
        };
    }
};
exports.userServices = {
    getUsers,
    updateUser,
    deleteUser,
};
