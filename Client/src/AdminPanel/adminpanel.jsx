import React, { useEffect, useState } from "react";
import { ShoppingBag, Package, Frame, BarChart3, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalFrames: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/dashboard/stats");
      setStats({
        totalOrders: response.data.totalOrders || 0,
        totalProducts: response.data.totalProducts || 0,
        totalFrames: response.data.totalFrames || 0,
        totalRevenue: response.data.totalRevenue || 0,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: loading ? "..." : stats.totalOrders.toLocaleString("en-IN"),
      color: "bg-blue-500",
      link: "/admin/orders",
    },
    {
      icon: Package,
      label: "Total Products",
      value: loading ? "..." : stats.totalProducts.toLocaleString("en-IN"),
      color: "bg-green-500",
      link: "/admin/products",
    },
    {
      icon: Frame,
      label: "Total Frames",
      value: loading ? "..." : stats.totalFrames.toLocaleString("en-IN"),
      color: "bg-purple-500",
      link: "/admin/frames",
    },
    {
      icon: BarChart3,
      label: "Revenue",
      value: loading ? "..." : `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      color: "bg-indigo-500",
      link: "/admin/revenue",
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin panel</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">
                    {stat.label}
                  </p>
                  {loading ? (
                    <div className="flex items-center mt-2">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-gray-800 mt-2">
                      {stat.value}
                    </p>
                  )}
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Link
          to="/admin/orders"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <ShoppingBag className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Orders</h3>
              <p className="text-gray-600 text-sm">Manage all orders</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/products"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <Package className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Products</h3>
              <p className="text-gray-600 text-sm">Manage products</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/frames"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-lg">
              <Frame className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Frames</h3>
              <p className="text-gray-600 text-sm">Manage frames</p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/revenue"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-4 rounded-lg">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Revenue</h3>
              <p className="text-gray-600 text-sm">View monthly revenue</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;
