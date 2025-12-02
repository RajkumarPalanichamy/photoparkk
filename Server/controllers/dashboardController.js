import Order from "../models/orders.js";
import FrameOrder from "../models/framesorder.js";
import Newarrivaldata from "../models/newarrivals.js";
import SpecialOffersdata from "../models/specialoffers.js";
import FrameCustomize from "../models/framescustomize.js";

// ✅ Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // Get total orders count (common orders + frame orders)
    const [totalCommonOrders, totalFrameOrders] = await Promise.all([
      Order.countDocuments(),
      FrameOrder.countDocuments(),
    ]);
    const totalOrders = totalCommonOrders + totalFrameOrders;

    // Get total products count (new arrivals + special offers)
    const [totalNewArrivals, totalSpecialOffers] = await Promise.all([
      Newarrivaldata.countDocuments(),
      SpecialOffersdata.countDocuments(),
    ]);
    const totalProducts = totalNewArrivals + totalSpecialOffers;

    // Get total frames count
    const totalFrames = await FrameCustomize.countDocuments();

    // Calculate total revenue
    // For common orders
    const commonOrdersRevenue = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    // For frame orders - calculate from items
    const frameOrdersRevenue = await FrameOrder.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$items.total" },
        },
      },
    ]);

    const commonRevenue = commonOrdersRevenue[0]?.total || 0;
    const frameRevenue = frameOrdersRevenue[0]?.total || 0;
    const totalRevenue = commonRevenue + frameRevenue;

    res.json({
      totalOrders,
      totalProducts,
      totalFrames,
      totalRevenue,
      breakdown: {
        commonOrders: totalCommonOrders,
        frameOrders: totalFrameOrders,
        newArrivals: totalNewArrivals,
        specialOffers: totalSpecialOffers,
        commonRevenue,
        frameRevenue,
      },
    });
  } catch (err) {
    console.error("❌ Failed to fetch dashboard stats:", err);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: err.message,
    });
  }
};

