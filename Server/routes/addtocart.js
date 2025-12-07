import express from "express";
import upload from "../Middleware/upload.js"; // Memory-based multer config
import { protect } from "../Middleware/authmiddleware.js";
import {
  uploadImage,
  addToCart,
  getCartItemsByUser,
  getSingleCartItem,
  getCartItemByUserAndProduct,
  updateCartItem,
  deleteCartItem,
} from "../controllers/addToCartController.js";

const router = express.Router();

// Image Upload to Cloudinary
router.post("/api/upload-image", upload.single("image"), uploadImage);

// Cart Functionality
router.post("/", addToCart);
router.get("/user/:userId", protect, getCartItemsByUser);
router.get("/:cartItemId", getSingleCartItem);
router.get("/user/:userId/product/:productId", protect, getCartItemByUserAndProduct);
router.put("/:itemId", updateCartItem);
router.delete("/:itemId", deleteCartItem);

export default router;
