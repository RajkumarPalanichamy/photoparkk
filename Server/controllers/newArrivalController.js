import Newarrivaldata from "../models/newarrivals.js";
import { v2 as cloudinary } from "cloudinary";

export const createNewArrival = async (req, res) => {
  try {
    let { title, content, rating, thickness, sizes, stock, quantity } = req.body;

    if (typeof sizes === "string") {
      try {
        sizes = JSON.parse(sizes);
      } catch {
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

    const parsedSizes = sizes.map((size) => {
      const price = Number(size.price);
      const original = Number(size.original);
      if (isNaN(price) || isNaN(original)) throw new Error("Invalid numeric input in sizes");
      return { label: size.label, price, original };
    });

    const parsedRating = Number(rating);
    if (isNaN(parsedRating)) {
      return res.status(400).json({ message: "Invalid numeric input in rating" });
    }

    // ✅ Upload to Cloudinary
    let imageUrl = null;
    if (req.file?.buffer) {
      const cloudUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "new_arrivals" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      imageUrl = cloudUpload.secure_url;
    }

    const posting = new Newarrivaldata({
      title,
      content,
      rating: parsedRating,
      thickness,
      sizes: parsedSizes,
      stock,
      image: imageUrl,
      quantity,
    });

    const saved = await posting.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error("New Arrival POST error:", error.message);
    return res.status(400).json({ message: error.message || "Something went wrong" });
  }
};

export const getAllNewArrivals = async (req, res) => {
  try {
    const items = await Newarrivaldata.find();
    return res.json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNewArrivalById = async (req, res) => {
  try {
    const item = await Newarrivaldata.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "NOT FOUND" });
    return res.json(item);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateNewArrival = async (req, res) => {
  try {
    const post = await Newarrivaldata.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "NOT FOUND" });

    const { title, content, rating, thickness, sizes, stock, quantity } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (rating) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating)) return res.status(400).json({ message: "Invalid rating" });
      post.rating = parsedRating;
    }
    if (thickness) post.thickness = thickness;
    if (stock) post.stock = stock;
    if (quantity) post.quantity = quantity;

    if (sizes) {
      let parsedSizes = sizes;
      if (typeof sizes === "string") {
        try {
          parsedSizes = JSON.parse(sizes);
        } catch {
          return res.status(400).json({ message: "Invalid sizes format" });
        }
      }
      post.sizes = parsedSizes.map((size) => {
        const price = Number(size.price);
        const original = Number(size.original);
        if (isNaN(price) || isNaN(original)) {
          throw new Error("Invalid numeric input in sizes");
        }
        return { label: size.label, price, original };
      });
    }

    if (req.file?.buffer) {
      const cloudUpload = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "new_arrivals" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });
      post.image = cloudUpload.secure_url;
    }

    const updated = await post.save();
    return res.json(updated);
  } catch (error) {
    console.error("Update error:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

export const deleteNewArrival = async (req, res) => {
  try {
    const deleted = await Newarrivaldata.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "NOT FOUND" });
    return res.json({ message: "Post deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
