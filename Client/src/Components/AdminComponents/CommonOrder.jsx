import React, { useEffect, useState, useRef, useCallback } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Search,
  Download,
  Eye,
  Image as ImageIcon,
  X,
  Loader2,
  Package,
  CheckCircle,
  Truck,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Trash2,
} from "lucide-react";

const CommonOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");

  // Status mapping: value -> display label
  const statusOptions = [
    { value: "all", label: "All Orders" },
    { value: "completed", label: "Completed" },
    { value: "processing", label: "Processing" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Sort mapping: value -> display label
  const sortOptions = [
    { value: "newest", label: "Sort by: Newest" },
    { value: "oldest", label: "Sort by: Oldest" },
    { value: "price_desc", label: "Sort by: Price (High to Low)" },
    { value: "price_asc", label: "Sort by: Price (Low to High)" },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const modalRef = useRef(null);
  const ordersPerPage = 5;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: ordersPerPage.toString(),
      });

      if (filter && filter !== "all") {
        params.append("status", filter);
      }

      if (sortBy) {
        params.append("sortBy", sortBy);
      }

      if (selectedTimePeriod) {
        params.append("period", selectedTimePeriod);
      }

      if (debouncedSearchQuery.trim()) {
        params.append("search", debouncedSearchQuery.trim());
      }

      const res = await axiosInstance.get(`/orders?${params.toString()}`);

      // Handle both new format (with pagination) and old format (array)
      if (res.data.orders) {
        setOrders(res.data.orders);
        setTotalOrders(res.data.total || res.data.orders.length);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setOrders(Array.isArray(res.data) ? res.data : []);
        setTotalOrders(Array.isArray(res.data) ? res.data.length : 0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setOrders([]);
      setTotalOrders(0);
      setTotalPages(1);
    }
  }, [currentPage, filter, sortBy, debouncedSearchQuery, selectedTimePeriod]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showDetailsModal &&
        modalRef.current &&
        !modalRef.current.contains(event.target)
      ) {
        setShowDetailsModal(false);
        setSelectedOrder(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDetailsModal]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosInstance.put(`/orders/${orderId}`, { status: newStatus });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("❌ Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axiosInstance.delete(`/orders/${orderId}`);
      alert("✅ Order deleted successfully");
      // Refresh orders list
      fetchOrders();
      // Close modal if the deleted order was selected
      if (selectedOrder?._id === orderId) {
        setShowDetailsModal(false);
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("❌ Failed to delete order");
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

  const getStatusConfig = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-success-light",
          text: "text-success",
          label: "Delivered",
        };
      case "Out for Delivery":
        return {
          bg: "bg-warning-light",
          text: "text-warning",
          label: "Out for Delivery",
        };
      case "Shipped":
        return {
          bg: "bg-primary-light",
          text: "text-secondary",
          label: "Shipped",
        };
      default:
        return {
          bg: "bg-warning-light",
          text: "text-warning",
          label: "Processing",
        };
    }
  };

  const paginatedOrders = orders;

  // Reset to page 1 when filter/search/sort/period changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearchQuery, sortBy, selectedTimePeriod]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleViewDetails = async (order) => {
    try {
      setLoadingOrderDetails(true);
      setShowDetailsModal(true);
      const response = await axiosInstance.get(`/orders/${order._id}`);
      setSelectedOrder(response.data);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setSelectedOrder(order);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  return (
    <>
      <div className="w-full">
        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-6">
          {/* Left Side - Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[15px] font-medium text-slate-600">
              Filter by:
            </span>
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`px-4 py-2 cursor-pointer border rounded-md text-sm font-medium transition ${
                  filter === option.value
                    ? "bg-primary border-primary text-white hover:bg-primary-hover"
                    : "bg-white border-neutral-300 text-slate-900 hover:bg-neutral-50"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Right Side - Time Period and Sort Selects */}
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedTimePeriod}
              onChange={(e) => setSelectedTimePeriod(e.target.value)}
              className="appearance-none px-4 py-2.5 bg-white border border-neutral-neutral-400 text-slate-900 text-sm rounded-md focus:outline-primary focus:ring-2 focus:ring-primary-light cursor-pointer"
            >
              <option value="">All Time</option>
              <option value="last_month">Last Month</option>
              <option value="last_three_months">Last 3 Months</option>
              <option value="last_six_months">Last 6 Months</option>
              <option value="last_year">Last Year</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-4 py-2.5 bg-white border border-neutral-neutral-400 text-slate-900 text-sm rounded-md focus:outline-primary focus:ring-2 focus:ring-primary-light cursor-pointer"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Orders List */}
        {paginatedOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-300 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-secondary mb-2">
              No Orders Found
            </h3>
            <p className="text-neutral-500">No product orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {paginatedOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status || "Pending");
              const imageUrl =
                order.cartItemId?.uploadedImageUrl || order.cartItemId?.image;
              const totalAmount =
                order.cartItemId?.totalAmount || order.amount || 0;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-xl border border-neutral-300 overflow-hidden p-6"
                >
                  {/* Order Header */}
                  <div className="flex flex-wrap justify-between gap-6 mb-6">
                    <div className="max-w-96">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-[15px] font-semibold text-slate-600">
                          Order #{order._id?.slice(-8).toUpperCase()}
                        </span>
                        <span
                          className={`px-3 py-1.5 ${statusConfig.bg} ${statusConfig.text} text-xs font-medium rounded-md`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm">
                        Placed on {formatDate(order.createdAt)} at{" "}
                        {formatTime(order.createdAt)}
                      </p>
                      <p className="text-slate-600 text-sm mt-1">
                        Customer:{" "}
                        {order.deliveryDetails?.name ||
                          order.userId?.name ||
                          "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-slate-900">
                        ₹{totalAmount.toLocaleString("en-IN")}
                      </p>
                      <p className="text-slate-600 text-sm mt-2">1 item</p>
                    </div>
                  </div>

                  <hr className="border-neutral-300 my-6" />

                  {/* Product Display */}
                  <div className="flex flex-wrap items-center gap-8 mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-neutral-100 p-1 rounded-md overflow-hidden flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={order.cartItemId?.title || "Product"}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-neutral-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-[15px] font-medium text-slate-900">
                          {order.cartItemId?.title || "Product"}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Qty: {order.cartItemId?.quantity || 1}
                        </p>
                        {order.cartItemId?.size && (
                          <p className="text-xs text-slate-600 mt-1">
                            Size: {order.cartItemId.size}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => handleViewDetails(order)}
                      className="px-4 py-2 bg-white border border-neutral-300 rounded-md text-sm text-slate-900 font-medium cursor-pointer hover:bg-neutral-50 transition flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    {order.status !== "Delivered" && (
                      <select
                        value={order.status || "Pending"}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        className="px-4 py-2 bg-white border border-neutral-300 rounded-md text-sm text-slate-900 font-medium cursor-pointer hover:bg-neutral-50 transition focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">
                          Out for Delivery
                        </option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    )}
                    <button
                      onClick={() => handleDeleteOrder(order._id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium cursor-pointer transition flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalOrders > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              Showing{" "}
              <span className="font-medium">
                {paginatedOrders.length === 0
                  ? 0
                  : (currentPage - 1) * ordersPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * ordersPerPage, totalOrders)}
              </span>{" "}
              of <span className="font-medium">{totalOrders}</span> orders
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
              {Array.from({ length: Math.min(totalPages, 4) }, (_, i) => {
                let pageNum;
                if (totalPages <= 4) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 3 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "bg-white border border-neutral-300 text-slate-900 hover:bg-neutral-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-neutral-300 rounded-md text-sm font-medium hover:bg-neutral-50 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto">
          <div
            ref={modalRef}
            className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xl my-8 relative max-h-[90vh] flex flex-col"
          >
            {loadingOrderDetails ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-neutral-600">
                  Loading order details...
                </span>
              </div>
            ) : selectedOrder ? (
              <>
                {/* Header */}
                <div className="bg-primary px-6 py-4 relative flex-shrink-0">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedOrder(null);
                    }}
                    className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors z-10"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  <div className="flex items-center justify-between gap-2 pr-10">
                    <h2 className="text-lg font-semibold text-white">
                      Order Details
                    </h2>
                    {(() => {
                      const statusConfig = getStatusConfig(
                        selectedOrder.status
                      );
                      return (
                        <span
                          className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.label}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-slate-200 text-sm mt-2">
                    Order #{selectedOrder._id?.slice(-8).toUpperCase()}
                  </p>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                  {/* Order Info */}
                  <div className="flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-slate-500 text-sm font-medium">
                        Order Number
                      </p>
                      <p className="text-slate-900 text-sm font-medium mt-2">
                        #{selectedOrder._id?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium">Date</p>
                      <p className="text-slate-900 text-sm font-medium mt-2">
                        {formatFullDate(selectedOrder.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium">
                        Total
                      </p>
                      <p className="text-sm font-medium text-primary-hover mt-2">
                        ₹
                        {(
                          selectedOrder.cartItemId?.totalAmount ||
                          selectedOrder.amount ||
                          0
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div className="bg-neutral-100 rounded-xl p-4 mt-8">
                    <h3 className="text-base font-medium text-slate-900 mb-6">
                      Shipping Information
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500 text-sm font-medium">
                          Customer
                        </p>
                        <p className="text-slate-900 text-sm font-medium mt-2">
                          {selectedOrder.deliveryDetails?.name ||
                            selectedOrder.userId?.name ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm font-medium">
                          Email
                        </p>
                        <p className="text-slate-900 text-sm font-medium mt-2">
                          {selectedOrder.deliveryDetails?.email ||
                            selectedOrder.userId?.email ||
                            "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm font-medium">
                          Phone
                        </p>
                        <p className="text-slate-900 text-sm font-medium mt-2">
                          {selectedOrder.deliveryDetails?.phone || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm font-medium">
                          Shipping Method
                        </p>
                        <p className="text-slate-900 text-sm font-medium mt-2">
                          Standard Delivery
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 text-sm font-medium">
                          Address
                        </p>
                        <p className="text-slate-900 text-sm font-medium mt-2">
                          {selectedOrder.deliveryDetails?.address || "N/A"}
                          {selectedOrder.deliveryDetails?.pincode &&
                            `, ${selectedOrder.deliveryDetails.pincode}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-8">
                    <h3 className="text-base font-medium text-slate-900 mb-6">
                      Order Items (1)
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 max-sm:flex-col">
                        <div className="w-[70px] h-[70px] bg-neutral-200 rounded-lg flex items-center justify-center shrink-0 relative group">
                          {selectedOrder.cartItemId?.uploadedImageUrl ||
                          selectedOrder.cartItemId?.image ? (
                            <>
                              <img
                                src={
                                  selectedOrder.cartItemId?.uploadedImageUrl ||
                                  selectedOrder.cartItemId?.image
                                }
                                alt={
                                  selectedOrder.cartItemId?.title || "Product"
                                }
                                className="w-14 h-14 object-contain rounded-sm"
                              />
                              <button
                                onClick={() =>
                                  handleDownload(
                                    selectedOrder.cartItemId
                                      ?.uploadedImageUrl ||
                                      selectedOrder.cartItemId?.image
                                  )
                                }
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center"
                                title="Download Image"
                              >
                                <Download className="w-5 h-5 text-white" />
                              </button>
                            </>
                          ) : (
                            <ImageIcon className="w-8 h-8 text-neutral-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-slate-900">
                            {selectedOrder.cartItemId?.title || "Product"}
                          </h4>
                          {selectedOrder.cartItemId?.size && (
                            <p className="text-slate-500 text-xs font-medium mt-2">
                              Size: {selectedOrder.cartItemId.size}
                            </p>
                          )}
                          <p className="text-slate-500 text-xs font-medium mt-1">
                            Qty: {selectedOrder.cartItemId?.quantity || 1}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-900 text-sm font-semibold">
                            ₹
                            {(
                              selectedOrder.cartItemId?.totalAmount ||
                              selectedOrder.amount ||
                              0
                            ).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-neutral-100 rounded-xl p-4 mt-8">
                    <h3 className="text-base font-medium text-slate-900 mb-6">
                      Order Summary
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                          Subtotal
                        </p>
                        <p className="text-slate-900 text-sm font-semibold">
                          ₹
                          {(
                            selectedOrder.cartItemId?.totalAmount ||
                            selectedOrder.amount ||
                            0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                          Shipping
                        </p>
                        <p className="text-slate-900 text-sm font-semibold">
                          ₹0.00
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-sm text-slate-500 font-medium">
                          Tax
                        </p>
                        <p className="text-slate-900 text-sm font-semibold">
                          ₹
                          {Math.round(
                            (selectedOrder.cartItemId?.totalAmount ||
                              selectedOrder.amount ||
                              0) * 0.18
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex justify-between pt-3 border-t border-neutral-300">
                        <p className="text-[15px] font-semibold text-slate-900">
                          Total
                        </p>
                        <p className="text-[15px] font-semibold text-primary-hover">
                          ₹
                          {(
                            (selectedOrder.cartItemId?.totalAmount ||
                              selectedOrder.amount ||
                              0) +
                            Math.round(
                              (selectedOrder.cartItemId?.totalAmount ||
                                selectedOrder.amount ||
                                0) * 0.18
                            )
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-neutral-100 px-6 py-4 flex-shrink-0 space-y-3">
                  {selectedOrder.status !== "Delivered" ? (
                    <select
                      value={selectedOrder.status || "Pending"}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder._id, e.target.value)
                      }
                      className="w-full px-4 py-2 bg-white border border-neutral-300 rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">
                        Order delivered and locked
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => handleDeleteOrder(selectedOrder._id)}
                    className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium cursor-pointer transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Order
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default CommonOrder;
