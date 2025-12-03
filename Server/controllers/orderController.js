import Order from "../models/orders.js";
import AddToCart from "../models/addtocart.js";
import User from "../models/users.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

// ✅ Create Order with Cloudinary image upload
export const createOrder = async (req, res) => {
  try {
    const { cartItemId, productType, deliveryDetails, amount } = req.body;
    const userId = req.user._id;

    // Parse deliveryDetails if it's a string
    let parsedDeliveryDetails = deliveryDetails;
    if (typeof deliveryDetails === "string") {
      try {
        parsedDeliveryDetails = JSON.parse(deliveryDetails);
      } catch (err) {
        console.error("Failed to parse deliveryDetails:", err);
        return res
          .status(400)
          .json({ error: "Invalid deliveryDetails format" });
      }
    }

    const allowedTypes = [
      "acrylic",
      "canvas",
      "backlight",
      "square",
      "circle",
      "Newarrivaldata",
      "SpecialOffersdata",
      "AcrylicCustomizedata",
      "Canvascustomizedata",
      "Backlightcustomizedata",
    ];
    if (!allowedTypes.includes(productType)) {
      return res.status(400).json({ error: "❌ Invalid productType" });
    }

    let imageUrl = null;

    // If a file is uploaded, use it; otherwise, get image from cart item
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, "orders");
      imageUrl = result.secure_url;
    } else if (cartItemId) {
      // Get image from cart item
      const cartItem = await AddToCart.findById(cartItemId);
      if (cartItem) {
        imageUrl = cartItem.image || cartItem.uploadedImageUrl;
      }
    }

    const newOrder = await Order.create({
      userId,
      cartItemId,
      productType,
      deliveryDetails: parsedDeliveryDetails,
      amount,
      image: imageUrl,
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error("❌ Order creation failed:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Get all orders (Admin) with search, filter, sort, and pagination
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, sortBy, page = 1, limit = 10 } = req.query;

    // Calculate pagination first (needed for early returns)
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query
    let query = {};

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

    // ADMIN: SEARCH ONLY BY USERNAME
    if (search) {
      const matchingUsers = await User.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const userIds = matchingUsers.map((u) => u._id);

      // If no user matches → return empty result
      if (userIds.length === 0) {
        return res.json({
          orders: [],
          total: 0,
          page: pageNum,
          limit: limitNum,
          totalPages: 0,
        });
      }

      query.userId = { $in: userIds };
    }

    // Build sort
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === "Oldest") {
      sort = { createdAt: 1 };
    } else if (sortBy === "Price (High to Low)") {
      sort = { amount: -1 };
    } else if (sortBy === "Price (Low to High)") {
      sort = { amount: 1 };
    }

    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(query)
      .populate("cartItemId")
        .populate("userId", "name email")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      orders,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    console.error("❌ Failed to fetch orders:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch orders", message: err.message });
  }
};

// ✅ Get user-specific orders with search, filter, sort, and pagination
export const getUserOrders = async (req, res) => {
  try {
    const { status, search, sortBy, page = 1, limit = 10 } = req.query;
    const userId = req.params.userId;

    // Calculate pagination first (needed for early returns)
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

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

    // USER: Search should match his own name → if matches → show all orders
    // If not → return empty
    if (search) {
      const user = await User.findById(userId).select("name");

      if (!user || !user.name || !new RegExp(search, "i").test(user.name)) {
        // search doesn't match username → no results
        return res.json({
          orders: [],
          total: 0,
          page: pageNum,
          limit: limitNum,
          totalPages: 0,
        });
      }
      // Username matches - show all orders for this user (query already filtered by userId)
    }

    // Build sort
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === "Oldest") {
      sort = { createdAt: 1 };
    } else if (
      sortBy === "Price (High to Low)" ||
      sortBy === "Price (Low to High)"
    ) {
      sort = { amount: sortBy === "Price (High to Low)" ? -1 : 1 };
    }

    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("cartItemId")
        .sort(sort)
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      orders,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user orders", error: err.message });
  }
};

// ✅ Get single order by ID with all details (optimized)
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId; // Optional: verify ownership

    const order = await Order.findById(id)
      .populate({
        path: "cartItemId",
        select:
          "title size color quantity totalAmount image uploadedImageUrl productType",
      })
      .populate({
        path: "userId",
        select: "name email phone",
      })
      .lean(); // Use lean() for better performance

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Verify ownership if userId is provided
    if (
      userId &&
      order.userId._id?.toString() !== userId &&
      order.userId.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(order);
  } catch (err) {
    console.error("❌ Failed to fetch order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("❌ Failed to update order status:", err);
    res.status(500).json({ message: "Server error" });
  }
};
