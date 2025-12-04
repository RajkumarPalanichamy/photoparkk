import FrameOrder from "../models/framesorder.js";
import User from "../models/users.js";
import { v2 as cloudinary } from "cloudinary";

// ✅ Create a new frame order
export const createFrameOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, shippingDetails } = req.body;

    if (!items?.length || !shippingDetails?.fullName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing fields" });
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
    } else if (
      sortBy === "price_desc" ||
      sortBy === "Price (High to Low)" ||
      sortBy === "price_asc" ||
      sortBy === "Price (Low to High)"
    ) {
      // For frame orders, we need to calculate total from items
      // This is complex, so we'll sort by createdAt and let frontend handle it
      // Or we can add a virtual field for total
      sort = { createdAt: -1 };
    }

    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [orders, total] = await Promise.all([
      FrameOrder.find(query).sort(sort).skip(skip).limit(limitNum),
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
    if (
      userId &&
      order.userId._id?.toString() !== userId &&
      order.userId.toString() !== userId
    ) {
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

// ✅ Admin: Get all orders with search, filter, sort, and pagination
export const getAllFrameOrders = async (req, res) => {
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
    } else if (
      sortBy === "price_desc" ||
      sortBy === "Price (High to Low)" ||
      sortBy === "price_asc" ||
      sortBy === "Price (Low to High)"
    ) {
      // For price sorting, we'll sort by createdAt and let frontend handle it
      // Or we can add aggregation to calculate total
      sort = { createdAt: -1 };
    }

    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [orders, total] = await Promise.all([
      FrameOrder.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate("userId", "name email"),
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
    console.error("❌ Failed to fetch all orders:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete frame order
export const deleteFrameOrder = async (req, res) => {
  try {
    const deletedOrder = await FrameOrder.findByIdAndDelete(req.params.id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Frame order deleted successfully" });
  } catch (err) {
    console.error("❌ Failed to delete frame order:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
