import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { FaSearch, FaDownload, FaUser, FaBox, FaRuler, FaRupeeSign, FaPhone, FaMapPin, FaHome, FaShippingFast, FaCheckCircle } from "react-icons/fa";

const CommonOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("✅ Order status updated!");
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("❌ Failed to update order status");
    }
  };

  const handleDownload = (url, name = "user_uploaded_image.jpg") => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/jpeg");
      link.download = name;
      link.click();
    };

    img.onerror = () => {
      alert("❌ Failed to download image. Check image URL or CORS settings.");
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Shipped": return "bg-blue-100 text-blue-800";
      case "Out for Delivery": return "bg-orange-100 text-orange-800";
      case "Delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders.filter((order) =>
    (order.deliveryDetails?.name || "")
      .toLowerCase()
      .includes(filterName.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {filteredOrders.map((order) => {
              const imageUrl =
                order.cartItemId?.uploadedImageUrl || order.cartItemId?.image;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Image Section */}
                  <div className="relative bg-gray-100 p-4 flex justify-center">
                    {imageUrl ? (
                      <div className="text-center">
                        <img
                          src={imageUrl}
                          alt="Uploaded"
                          className="w-48 h-48 object-cover rounded-lg border-2 border-gray-300"
                        />
                        <button
                          onClick={() => handleDownload(imageUrl)}
                          className="mt-3 inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                        >
                          <FaDownload className="text-sm" />
                          Download Image
                        </button>
                      </div>
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 flex flex-col items-center justify-center rounded-lg text-gray-500">
                        <div className="text-4xl mb-2">📷</div>
                        <span className="text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    {/* Customer Info */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaUser className="text-blue-500" />
                        Customer Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Name:</span>
                          <span className="text-gray-900">
                            {order.deliveryDetails?.name || order.userId?.name || "N/A"}
                          </span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Email:</span>
                          <span className="text-gray-600 text-xs">
                            {order.userId?.email || "N/A"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaBox className="text-green-500" />
                        Product Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="font-medium text-gray-700">Product:</span>
                          <span className="text-gray-900">{order.cartItemId?.title || "N/A"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaRuler className="text-gray-400" />
                          <span className="font-medium text-gray-700">Size:</span>
                          <span className="text-gray-900">{order.cartItemId?.size || "N/A"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaRupeeSign className="text-gray-400" />
                          <span className="font-medium text-gray-700">Price:</span>
                          <span className="text-green-600 font-semibold">
                            ₹{order.cartItemId?.totalAmount ?? "0"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FaShippingFast className="text-purple-500" />
                        Delivery Info
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2">
                          <FaPhone className="text-gray-400" />
                          <span className="font-medium text-gray-700">Phone:</span>
                          <span className="text-gray-900">{order.deliveryDetails?.phone || "N/A"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <FaMapPin className="text-gray-400" />
                          <span className="font-medium text-gray-700">Pincode:</span>
                          <span className="text-gray-900">{order.deliveryDetails?.pincode || "N/A"}</span>
                        </p>
                        <p className="flex items-start gap-2">
                          <FaHome className="text-gray-400 mt-1" />
                          <div>
                            <span className="font-medium text-gray-700">Address:</span>
                            <p className="text-gray-900 text-xs mt-1">
                              {order.deliveryDetails?.address || "N/A"}
                            </p>
                          </div>
                        </p>
                      </div>
                    </div>

                    {/* Status Section */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="font-semibold text-gray-700">Order Status</label>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={order.status === "Delivered"}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                      
                      {order.status === "Delivered" && (
                        <div className="flex items-center gap-2 mt-2 text-green-600">
                          <FaCheckCircle />
                          <span className="text-sm font-medium">Order delivered and locked</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommonOrder;