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
    const { status, search, sortBy, page = 1, limit = 10, period } = req.query;

    // Calculate pagination first (needed for early returns)
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query
    let query = {};

    // Apply status filter - accept both old labels and new values
    if (status && status !== "all" && status !== "All Orders") {
      if (status === "completed" || status === "Completed") {
        query.status = "Delivered";
      } else if (status === "processing" || status === "Processing") {
        query.status = { $in: ["Pending", "Shipped", "Out for Delivery"] };
      } else if (status === "cancelled" || status === "Cancelled") {
        query.status = "Cancelled";
      }
    }

    // Apply period filter
    if (period) {
      const now = new Date();
      let startDate = null;
      let endDate = null;

      switch (period) {
        case "last_month": {
          // Get the previous complete calendar month
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth(); // 0-11
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January -> December of previous year
          const lastMonthYear =
            currentMonth === 0 ? currentYear - 1 : currentYear;

          // First day of last month at 00:00:00
          const lastMonthStart = new Date(
            lastMonthYear,
            lastMonth,
            1,
            0,
            0,
            0,
            0
          );
          // Last day of last month at 23:59:59.999
          const lastMonthEnd = new Date(
            lastMonthYear,
            lastMonth + 1,
            0,
            23,
            59,
            59,
            999
          );

          startDate = lastMonthStart;
          endDate = lastMonthEnd;
          break;
        }
        case "last_three_months": {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          threeMonthsAgo.setDate(1);
          startDate = threeMonthsAgo;
          endDate = now;
          break;
        }
        case "last_six_months": {
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          sixMonthsAgo.setDate(1);
          startDate = sixMonthsAgo;
          endDate = now;
          break;
        }
        case "last_year": {
          const lastYear = now.getFullYear() - 1;
          const yearStart = new Date(lastYear, 0, 1);
          const yearEnd = new Date(lastYear, 11, 31, 23, 59, 59, 999);
          startDate = yearStart;
          endDate = yearEnd;
          break;
        }
        default:
          // Unknown period, ignore
          break;
      }

      if (startDate && endDate) {
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
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

    // Build sort - accept both old labels and new values
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === "oldest" || sortBy === "Oldest") {
      sort = { createdAt: 1 };
    } else if (sortBy === "newest" || sortBy === "Newest") {
      sort = { createdAt: -1 };
    } else if (sortBy === "price_desc" || sortBy === "Price (High to Low)") {
      sort = { amount: -1 };
    } else if (sortBy === "price_asc" || sortBy === "Price (Low to High)") {
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
    const { status, search, sortBy, page = 1, limit = 10, period } = req.query;
    const userId = req.params.userId;

    // Calculate pagination first (needed for early returns)
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query
    let query = { userId };

    // Apply status filter - accept both old labels and new values
    if (status && status !== "all" && status !== "All Orders") {
      if (status === "completed" || status === "Completed") {
        query.status = "Delivered";
      } else if (status === "processing" || status === "Processing") {
        query.status = { $in: ["Pending", "Shipped", "Out for Delivery"] };
      } else if (status === "cancelled" || status === "Cancelled") {
        query.status = "Cancelled";
      }
    }

    // Apply period filter
    if (period) {
      const now = new Date();
      let startDate = null;
      let endDate = null;

      switch (period) {
        case "last_month": {
          // Get the previous complete calendar month
          // If current month is October (month 9), last month is September (month 8)
          const currentYear = now.getFullYear();
          const currentMonth = now.getMonth(); // 0-11
          const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // Handle January -> December of previous year
          const lastMonthYear =
            currentMonth === 0 ? currentYear - 1 : currentYear;

          // First day of last month at 00:00:00
          const lastMonthStart = new Date(
            lastMonthYear,
            lastMonth,
            1,
            0,
            0,
            0,
            0
          );
          // Last day of last month at 23:59:59.999
          const lastMonthEnd = new Date(
            lastMonthYear,
            lastMonth + 1,
            0,
            23,
            59,
            59,
            999
          );

          startDate = lastMonthStart;
          endDate = lastMonthEnd;
          break;
        }
        case "last_three_months": {
          const threeMonthsAgo = new Date(now);
          threeMonthsAgo.setMonth(now.getMonth() - 3);
          threeMonthsAgo.setDate(1);
          startDate = threeMonthsAgo;
          endDate = now;
          break;
        }
        case "last_six_months": {
          const sixMonthsAgo = new Date(now);
          sixMonthsAgo.setMonth(now.getMonth() - 6);
          sixMonthsAgo.setDate(1);
          startDate = sixMonthsAgo;
          endDate = now;
          break;
        }
        case "last_year": {
          const lastYear = now.getFullYear() - 1;
          const yearStart = new Date(lastYear, 0, 1);
          const yearEnd = new Date(lastYear, 11, 31, 23, 59, 59, 999);
          startDate = yearStart;
          endDate = yearEnd;
          break;
        }
        default:
          // Unknown period, ignore
          break;
      }

      if (startDate && endDate) {
        query.createdAt = {
          $gte: startDate,
          $lte: endDate,
        };
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

    // Build sort - accept both old labels and new values
    let sort = { createdAt: -1 }; // Default: newest first
    if (sortBy === "oldest" || sortBy === "Oldest") {
      sort = { createdAt: 1 };
    } else if (sortBy === "newest" || sortBy === "Newest") {
      sort = { createdAt: -1 };
    } else if (sortBy === "price_desc" || sortBy === "Price (High to Low)") {
      sort = { amount: -1 };
    } else if (sortBy === "price_asc" || sortBy === "Price (Low to High)") {
      sort = { amount: 1 };
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

// ✅ Delete order
export const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
