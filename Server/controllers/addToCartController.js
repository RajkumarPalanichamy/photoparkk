import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import addtocartdata from "../models/addtocart.js";
import cloudinary from "../config/cloudinary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../addtocartUploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "image", folder: "addtocart" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    res.status(200).json({ imageUrl: result.secure_url }); // ✅ Cloudinary URL
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ error: "Failed to upload image to Cloudinary." });
  }
};


export const addToCart = async (req, res) => {
  try {
    const {
      userId,
      productId,
      productType,
      title,
      quantity,
      image,
      size,
      thickness,
      price,
      totalAmount,
      uploadedImageUrl,
    } = req.body;

    const allowedTypes = ["Newarrivaldata", "SpecialOffersdata", "AcrylicCustomizedata", "Canvascustomizedata", "Backlightcustomizedata"];
    if (!allowedTypes.includes(productType)) {
      return res.status(400).json({ error: "Invalid productType." });
    }

    if (!userId || !productType || !title || !price || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    if (!["AcrylicCustomizedata", "Canvascustomizedata", "Backlightcustomizedata"].includes(productType) && !productId) {
      return res.status(400).json({ error: "productId is required for non-customized products." });
    }

    const cartItem = new addtocartdata({
      userId,
      productId: productId || null,
      productType,
      title,
      quantity,
      image,
      size,
      thickness,
      price,
      totalAmount,
      uploadedImageUrl,
    });

    const savedItem = await cartItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart." });
  }
};

export const getCartItemsByUser = async (req, res) => {
  try {
    const requestedUserId = req.params.userId;
    if (req.user._id.toString() !== requestedUserId.toString()) {
      return res.status(403).json({ message: "Access denied. User ID does not match token." });
    }

    const items = await addtocartdata.find({ userId: requestedUserId }).populate("productId");
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items." });
  }
};

export const getSingleCartItem = async (req, res) => {
  try {
    const item = await addtocartdata.findById(req.params.cartItemId).populate("productId");
    if (!item) return res.status(404).json({ error: "Cart item not found." });
    res.status(200).json(item);
  } catch (err) {
    console.error("Error fetching single cart item:", err);
    res.status(500).json({ error: "Failed to fetch cart item." });
  }
};

export const getCartItemByUserAndProduct = async (req, res) => {
  const { userId, productId } = req.params;

  try {
    if (req.user._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Access denied. User ID does not match token." });
    }

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid userId or productId format" });
    }

    const item = await addtocartdata
      .findOne({
        userId: new mongoose.Types.ObjectId(userId),
        productId: new mongoose.Types.ObjectId(productId),
      })
      .populate("productId");

    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    console.error("Error fetching cart item:", error);
    res.status(500).json({ error: "Failed to fetch cart item." });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1." });
    }

    const item = await addtocartdata.findById(itemId);
    if (!item) {
      return res.status(404).json({ error: "Cart item not found." });
    }

    // Update quantity and recalculate totalAmount
    item.quantity = quantity;
    item.totalAmount = item.price * quantity;

    const updatedItem = await item.save();
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item." });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const deletedItem = await addtocartdata.findByIdAndDelete(req.params.itemId);
    if (!deletedItem) return res.status(404).json({ error: "Cart item not found." });
    res.status(200).json({ message: "Item removed from cart." });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Failed to remove item from cart." });
  }
};
