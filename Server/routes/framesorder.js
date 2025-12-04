import express from "express";
import {
  createFrameOrder,
  getUserFrameOrders,
  getFrameOrderById,
  updateFrameOrderStatus,
  getAllFrameOrders,
  deleteFrameOrder,
} from "../controllers/frameOrderController.js";
import { protect } from "../Middleware/authmiddleware.js";

const router = express.Router();

router.post("/create", protect, createFrameOrder);
router.get("/user/:userId", getUserFrameOrders);
router.get("/", getAllFrameOrders);
router.patch("/:id/status", updateFrameOrderStatus);
router.delete("/:id", protect, deleteFrameOrder);
router.get("/:id", getFrameOrderById); // Get single frame order details - must be after /user/:userId

// Log registered routes for debugging
console.log("✅ Frame Orders routes registered:");
console.log("   - DELETE /:id route available");

export default router;
