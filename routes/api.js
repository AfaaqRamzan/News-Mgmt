import express from "express";
import AuthController from "../controller/auth.controller.js";

const router = express.Router();


router.post("/auth/register", AuthController.register);

export default router;