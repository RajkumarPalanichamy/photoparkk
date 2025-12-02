import express from "express";
import {
  createFrameOrder,
  getUserFrameOrders,
  getFrameOrderById,
  updateFrameOrderStatus,
  getAllFrameOrders,
} from "../controllers/frameOrderController.js";
import { protect } from "../Middleware/authmiddleware.js";

const router = express.Router();

router.post("/create", protect, createFrameOrder);
router.get("/user/:userId", getUserFrameOrders);
router.get("/:id", getFrameOrderById); // Get single frame order details
router.patch("/:id/status", updateFrameOrderStatus);
router.get("/", getAllFrameOrders);

export default router;
