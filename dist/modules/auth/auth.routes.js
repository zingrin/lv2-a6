"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
exports.authRoutes = router;
router.post("/signup", auth_controller_1.authControllers.handleSignup);
router.post("/signin", auth_controller_1.authControllers.handleSignin);
