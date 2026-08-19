import express from "express";
import AuthController from "../controller/auth.controller.js";
import ProfileController from "../controller/profile.controller.js";
import authMiddleware from "../middleware/Authentication.middleware.js";

const router = express.Router();

// * Authentication Routes : Public Routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// * Profile Routes : Private Routes
router.get("/profile", authMiddleware, ProfileController.index);
router.put("/profile/:id", authMiddleware, ProfileController.update);

export default router;