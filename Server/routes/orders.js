import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { protect } from "../Middleware/authmiddleware.js";
import upload from "../Middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createOrder);
router.get("/", getAllOrders);
router.get("/user/:userId", getUserOrders);
router.get("/:id", getOrderById); // Get single order details - must be after /user/:userId
router.put("/:id", updateOrderStatus);
router.delete("/:id", protect, deleteOrder);

export default router;
