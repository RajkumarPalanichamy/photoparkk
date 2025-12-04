import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import { protect } from "../Middleware/authmiddleware.js";

const router = express.Router();

// Get dashboard statistics (protected route - admin only)
router.get("/stats", protect, getDashboardStats);

export default router;

