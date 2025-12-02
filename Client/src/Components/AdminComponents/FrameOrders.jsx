import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const FrameOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/frameorders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  const getNextStatus = (current) => {
    switch (current) {
      case "Pending":
        return "Shipped";
      case "Shipped":
        return "Out for Delivery";
      case "Out for Delivery":
        return "Delivered";
      default:
        return null;
    }
  };

  const handleAdvanceStatus = async (orderId, currentStatus) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return;

    try {
      await axiosInstance.patch(`/frameorders/${orderId}/status`, {
        status: nextStatus,
      });
      fetchOrders();
    } catch (err) {
      console.error("Error updating order status", err);
    }
  };

  const downloadImage = (url, filename) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = url;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/jpeg");

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = filename;
      link.click();
    };

    img.onerror = () => {
      alert("Failed to download image. It may not allow cross-origin access.");
    };
  };

  const filteredOrders = orders.filter((order) =>
    order.shippingDetails?.fullName
      ?.toLowerCase()
      .includes(filterName.trim().toLowerCase())
  );

  return (
    <div className="w-full">
      {/* 🔍 Filter by Name */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by user name..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 text-lg">No matching orders found.</p>
        </div>
      ) : (
        <div className="space-y-6">

          {filteredOrders.map((order) => (
        <div
          key={order._id}
          className="border p-6 rounded-xl shadow-md mb-6 bg-white"
        >
          {/* User Info */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">👤 User Details</h3>
            <p>
              <strong>Name:</strong> {order.shippingDetails.fullName}
            </p>
            <p>
              <strong>Phone:</strong> {order.shippingDetails.phone}
            </p>
            <p>
              <strong>Email:</strong> {order.shippingDetails.email}
            </p>
            <p>
              <strong>Address:</strong> {order.shippingDetails.address}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`inline-block px-2 py-1 rounded text-sm ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Out for Delivery"
                    ? "bg-orange-100 text-orange-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status || "Pending"}
              </span>
            </p>

            <p>
              <strong>Ordered At:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {order.status !== "Delivered" && (
              <button
                onClick={() => handleAdvanceStatus(order._id, order.status)}
                className="mt-3 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Mark as {getNextStatus(order.status)}
              </button>
            )}
          </div>

          {/* Ordered Items */}
          <div>
            <h3 className="text-xl font-semibold mb-3">🖼️ Frame Items</h3>

            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50 mb-4"
              >
                <div className="flex flex-col items-center">
                  <div className="border-[6px] border-gray-400 rounded-xl p-1">
                    <img
                      src={item.userImageUrl}
                      alt="User Uploaded"
                      className="w-40 h-40 object-cover rounded-md"
                    />
                  </div>
                  <p className="text-center mt-2 text-sm text-gray-500">
                    User Image
                  </p>
                  <button
                    onClick={() =>
                      downloadImage(
                        item.userImageUrl,
                        `user_image_${idx + 1}.jpg`
                      )
                    }
                    className="mt-1 text-lg text-blue-600 hover:underline"
                  >
                    ⬇️ Download
                  </button>
                </div>

                <div>
                  <p>
                    <strong>Title:</strong> {item.title}
                  </p>
                  <p>
                    <strong>Shape:</strong> {item.shape} |{" "}
                    <strong>Color:</strong> {item.color} |{" "}
                    <strong>Size:</strong> {item.size}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ₹{item.price}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Total: ₹{item.total}
                  </p>
                  <img
                    src={item.frameImageUrl}
                    alt="Frame"
                    className="w-40 mt-2 rounded border"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FrameOrders;
