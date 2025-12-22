"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const authD_1 = __importDefault(require("../../middlewares/authD"));
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.get("/", (0, authD_1.default)("admin"), user_controller_1.userControllers.getUsers);
router.put("/:userId", (0, authD_1.default)("admin", "customer"), user_controller_1.userControllers.updateUser);
router.delete("/:userId", (0, authD_1.default)("admin"), user_controller_1.userControllers.deleteUser);
exports.userRoutes = router;
