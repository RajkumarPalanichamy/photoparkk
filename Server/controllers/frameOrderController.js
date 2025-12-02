import FrameOrder from "../models/framesorder.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Create a new frame order
export const createFrameOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, shippingDetails } = req.body;

    if (!items?.length || !shippingDetails?.fullName) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const uploadedItems = [];

    for (const item of items) {
      if (
        !item.title ||
        !item.shape ||
        !item.color ||
        !item.size ||
        !item.frameImageUrl ||
        !item.userImageUrl
      ) {
        return res.status(400).json({
          success: false,
          message: "❌ One or more required item fields are missing",
          item,
        });
      }

      // Upload frame and user image to Cloudinary
      const [frameUpload, userUpload] = await Promise.all([
        cloudinary.uploader.upload(item.frameImageUrl, {
          folder: "frames/frame_images",
        }),
        cloudinary.uploader.upload(item.userImageUrl, {
          folder: "frames/user_images",
        }),
      ]);

      uploadedItems.push({
        title: item.title,
        shape: item.shape,
        color: item.color,
        size: item.size,
        price: Number(item.price),
        quantity: Number(item.quantity),
        total: Number(item.total),
        frameImageUrl: frameUpload.secure_url,
        userImageUrl: userUpload.secure_url,
      });
    }

    const newOrder = new FrameOrder({
      userId,
      items: uploadedItems,
      shippingDetails,
      status: "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: "✅ Frame order placed successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("❌ Frame order creation error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ✅ Get orders by userId with search, filter, sort, and pagination
export const getUserFrameOrders = async (req, res) => {
  try {
    const { status, search, sortBy, page = 1, limit = 10 } = req.query;
    const userId = req.params.userId;
    
    // Build query
    let query = { userId };
    
    // Apply status filter
    if (status && status !== "All Orders") {
      if (status === "Completed") {
        query.status = "Delivered";
      } else if (status === "Processing") {
        query.status = { $in: ["Pending", "Shipped", "Out for Delivery"] };
      } else if (status === "Cancelled") {
        query.status = "Cancelled";
      }
    }
    
    // Apply search filter (search in order ID or item titles)
    if (search) {
      query.$or = [
        { _id: { $regex: search, $options: "i" } },
        { "items.title": { $regex: search, $options: "i" } },
      ];
    }
    
    // Build sort
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === "Oldest") {
      sort = { createdAt: 1 };
    } else if (sortBy === "Price (High to Low)" || sortBy === "Price (Low to High)") {
      // For frame orders, we need to calculate total from items
      // This is complex, so we'll sort by createdAt and let frontend handle it
      // Or we can add a virtual field for total
      sort = { createdAt: -1 };
    }
    
    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    
    // Execute query
    const [orders, total] = await Promise.all([
      FrameOrder.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      FrameOrder.countDocuments(query),
    ]);
    
    res.status(200).json({
      orders,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("❌ Error fetching user orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single frame order by ID with all details (optimized)
export const getFrameOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId; // Optional: verify ownership

    const order = await FrameOrder.findById(id)
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .lean(); // Use lean() for better performance

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify ownership if userId is provided
    if (userId && order.userId._id?.toString() !== userId && order.userId.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Failed to fetch frame order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update order status
export const updateFrameOrderStatus = async (req, res) => {
  try {
    const updatedOrder = await FrameOrder.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedOrder);
  } catch (err) {
    console.error("❌ Failed to update order status:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

// ✅ Admin: Get all orders
export const getAllFrameOrders = async (req, res) => {
  try {
    const orders = await FrameOrder.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("❌ Failed to fetch all orders:", err);
    res.status(500).json({ error: err.message });
  }
};
