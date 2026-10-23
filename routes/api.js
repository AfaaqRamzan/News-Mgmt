import express from "express";
import AuthController from "../controller/auth.controller.js";
import ProfileController from "../controller/profile.controller.js";
import authMiddleware from "../middleware/Authentication.middleware.js";
import NewsController from "../controller/news.controller.js";

const router = express.Router();

// * Authentication Routes : Public Routes
router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// * Profile Routes : Private Routes
router.get("/profile", authMiddleware, ProfileController.index);
router.put("/profile/:id", authMiddleware, ProfileController.update);

// * News Routes : Public Routes
router.get("/news", NewsController.index);
router.get("/news/:id", NewsController.show);

// * News Routes : Private Routes
router.post("/news", authMiddleware, NewsController.store);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

export default router;
