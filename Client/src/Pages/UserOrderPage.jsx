import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
  Loader2,
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  X,
  Image as ImageIcon,
} from "lucide-react";

const UserOrderPage = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

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
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("");
  const ordersPerPage = 5;

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchAllOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Build query parameters - send values, not labels
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ordersPerPage.toString(),
        });

        // Only send status if not "all"
        if (filter && filter !== "all") {
          params.append("status", filter);
        }

        // Always send sortBy
        if (sortBy) {
          params.append("sortBy", sortBy);
        }

        if (debouncedSearchQuery.trim()) {
          params.append("search", debouncedSearchQuery.trim());
        }

        if (selectedTimePeriod) {
          params.append("period", selectedTimePeriod);
        }

        const [frameRes, commonRes] = await Promise.all([
          axiosInstance.get(
            `/frameorders/user/${user._id}?${params.toString()}`
          ),
          axiosInstance.get(`/orders/user/${user._id}?${params.toString()}`),
        ]);

        // Handle new API response format (with pagination) or old format (array)
        const frameData = frameRes.data.orders || frameRes.data;
        const commonData = commonRes.data.orders || commonRes.data;

        const frameOrders = (Array.isArray(frameData) ? frameData : []).map(
          (o) => ({
            ...o,
            type: "frame",
            createdAt: o.createdAt,
            status: o.status || "Pending",
          })
        );

        const commonOrders = (Array.isArray(commonData) ? commonData : []).map(
          (o) => ({
            ...o,
            type: "common",
            createdAt: o.createdAt,
            status: o.status || "Pending",
          })
        );

        const merged = [...frameOrders, ...commonOrders];

        // If API returns pagination info, use it; otherwise calculate from merged data
        if (
          frameRes.data.total !== undefined &&
          commonRes.data.total !== undefined
        ) {
          const total =
            (frameRes.data.total || 0) + (commonRes.data.total || 0);
          setTotalOrders(total);
          setTotalPages(
            Math.max(
              frameRes.data.totalPages || 1,
              commonRes.data.totalPages || 1
            )
          );
        } else {
          // Fallback: calculate from merged data
          setTotalOrders(merged.length);
          setTotalPages(Math.ceil(merged.length / ordersPerPage));
        }

        setAllOrders(merged);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [filter, sortBy, debouncedSearchQuery, currentPage, selectedTimePeriod]);

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          bg: "bg-warning-light",
          text: "text-warning",
          label: "Processing",
        };
      case "Shipped":
        return {
          bg: "bg-warning-light",
          text: "text-warning",
          label: "Processing",
        };
      case "Out for Delivery":
        return {
          bg: "bg-warning-light",
          text: "text-warning",
          label: "Processing",
        };
      case "Delivered":
        return {
          bg: "bg-success-light",
          text: "text-success",
          label: "Delivered",
        };
      case "Cancelled":
        return {
          bg: "bg-red-100",
          text: "text-red-900",
          label: "Cancelled",
        };
      default:
        return {
          bg: "bg-neutral-100",
          text: "text-secondary",
          label: status || "Processing",
        };
    }
  };

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

  const getOrderTotal = (order) => {
    if (order.type === "frame") {
      return (
        order.items?.reduce((sum, item) => sum + (item.total || 0), 0) || 0
      );
    }
    return order.cartItemId?.totalAmount || order.amount || 0;
  };

  // Apply client-side sorting for price (since backend doesn't handle frame order totals well)
  const getSortedOrders = () => {
    let sorted = [...allOrders];

    if (sortBy === "Price (High to Low)") {
      sorted.sort((a, b) => {
        const aTotal = getOrderTotal(a);
        const bTotal = getOrderTotal(b);
        return bTotal - aTotal;
      });
    } else if (sortBy === "Price (Low to High)") {
      sorted.sort((a, b) => {
        const aTotal = getOrderTotal(a);
        const bTotal = getOrderTotal(b);
        return aTotal - bTotal;
      });
    }
    // Other sorting is handled by backend

    return sorted;
  };

  const paginatedOrders = getSortedOrders();

  // Reset to page 1 when filter/search/sort/period changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, debouncedSearchQuery, sortBy, selectedTimePeriod]);

  const handleViewDetails = async (order) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?._id) return;

    try {
      setLoadingOrderDetails(true);
      setShowDetailsModal(true);

      // Fetch detailed order information from API
      const endpoint =
        order.type === "frame"
          ? `/frameorders/${order._id}?userId=${user._id}`
          : `/orders/${order._id}?userId=${user._id}`;

      const response = await axiosInstance.get(endpoint);
      const detailedOrder = {
        ...response.data,
        type: order.type, // Preserve type
      };

      setSelectedOrder(detailedOrder);
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      // Fallback to basic order data if API fails
      setSelectedOrder(order);
    } finally {
      setLoadingOrderDetails(false);
    }
  };

  const handleReorder = (order) => {
    // For frame orders, redirect to frames page
    if (order.type === "frame") {
      navigate("/frames");
      return;
    }

    // Map productType to navigation routes for common orders
    const routeMap = {
      Newarrivaldata: "/Offers",
      SpecialOffersdata: "/Offers", // Redirect to Offers page
      AcrylicCustomizedata: "/AcrylicPortrait", // Default to Portrait
      Canvascustomizedata: "/CanvasPortrait",
      Backlightcustomizedata: "/BacklightPortrait",
      acrylic: "/shop/acrylic",
      canvas: "/shop/canvas",
      backlight: "/shop/backlight-frames",
    };

    const route = routeMap[order.productType] || "/";
    navigate(route);
  };

  // Handle click outside modal to close
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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetailsModal]);

  if (loading) {
    return (
      <div className="bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-neutral-50 px-4 py-8">
        <div className="max-w-screen-xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-wrap justify-between items-center gap-6 mb-8">
            <div className="max-w-96">
              <h2 className="text-slate-900 text-2xl font-bold mb-3">
                Order History
              </h2>
              <p className="text-base text-slate-600">
                View and manage your past orders
              </p>
            </div>
          </div>

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
              <p className="text-neutral-500">
                {selectedTimePeriod
                  ? "No orders found for the selected time period."
                  : "You haven't placed any orders yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {paginatedOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const totalAmount = getOrderTotal(order);

                const itemCount =
                  order.type === "frame" ? order.items?.length || 0 : 1;

                // Get all items for display
                const displayItems =
                  order.type === "frame"
                    ? order.items || []
                    : [
                        {
                          image:
                            order.cartItemId?.uploadedImageUrl ||
                            order.cartItemId?.image,
                          title: order.cartItemId?.title || "Product",
                          quantity: order.cartItemId?.quantity || 1,
                          price:
                            order.cartItemId?.totalAmount || order.amount || 0,
                          size: order.cartItemId?.size,
                          color: order.cartItemId?.color || "N/A",
                        },
                      ];

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
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-slate-900">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </p>
                        <p className="text-slate-600 text-sm mt-2">
                          {itemCount} {itemCount === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    <hr className="border-neutral-300 my-6" />

                    {/* Products Display */}
                    <div className="flex flex-wrap items-center gap-8 mb-8">
                      {displayItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-neutral-100 p-1 rounded-md overflow-hidden flex items-center justify-center">
                            {item.image || item.userImageUrl ? (
                              <img
                                src={item.image || item.userImageUrl}
                                alt={item.title}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-neutral-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-[15px] font-medium text-slate-900">
                              {item.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                      ))}
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
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2 bg-white border border-neutral-300 rounded-md text-sm text-slate-900 font-medium cursor-pointer hover:bg-neutral-50 transition flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reorder
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
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
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
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
                      Order Confirmation
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
                    Thank you for your order!
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
                        ₹{getOrderTotal(selectedOrder).toLocaleString("en-IN")}
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
                          {selectedOrder.type === "frame"
                            ? selectedOrder.shippingDetails?.fullName
                            : selectedOrder.deliveryDetails?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm font-medium">
                          Email
                        </p>
                        <p className="text-slate-900 text-sm font-medium mt-2">
                          {selectedOrder.type === "frame"
                            ? selectedOrder.shippingDetails?.email
                            : selectedOrder.deliveryDetails?.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm font-medium">
                          Phone
                        </p>
                        <p className="text-slate-900 text-sm font-medium mt-2">
                          {selectedOrder.type === "frame"
                            ? selectedOrder.shippingDetails?.phone
                            : selectedOrder.deliveryDetails?.phone}
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
                          {selectedOrder.type === "frame"
                            ? selectedOrder.shippingDetails?.address
                            : selectedOrder.deliveryDetails?.address}
                          {", "}
                          {selectedOrder.type === "frame"
                            ? selectedOrder.shippingDetails?.pincode
                            : selectedOrder.deliveryDetails?.pincode}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mt-8">
                    <h3 className="text-base font-medium text-slate-900 mb-6">
                      Order Items (
                      {selectedOrder.type === "frame"
                        ? selectedOrder.items?.length || 0
                        : 1}
                      )
                    </h3>
                    <div className="space-y-4">
                      {selectedOrder.type === "frame" ? (
                        selectedOrder.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4 max-sm:flex-col"
                          >
                            <div className="w-[70px] h-[70px] bg-neutral-200 rounded-lg flex items-center justify-center shrink-0">
                              {item.userImageUrl ? (
                                <img
                                  src={item.userImageUrl}
                                  alt={item.title}
                                  className="w-14 h-14 object-contain rounded-sm"
                                />
                              ) : (
                                <ImageIcon className="w-8 h-8 text-neutral-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-slate-900">
                                {item.title}
                              </h4>
                              <p className="text-slate-500 text-xs font-medium mt-2">
                                Shape: {item.shape} | Color: {item.color} |
                                Size: {item.size}
                              </p>
                              <p className="text-slate-500 text-xs font-medium mt-1">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-slate-900 text-sm font-semibold">
                                ₹{item.total?.toLocaleString("en-IN")}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex items-start gap-4 max-sm:flex-col">
                          <div className="w-[70px] h-[70px] bg-neutral-200 rounded-lg flex items-center justify-center shrink-0">
                            {selectedOrder.cartItemId?.uploadedImageUrl ||
                            selectedOrder.cartItemId?.image ? (
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
                      )}
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
                          {getOrderTotal(selectedOrder).toLocaleString("en-IN")}
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
                            getOrderTotal(selectedOrder) * 0.18
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
                            getOrderTotal(selectedOrder) +
                            Math.round(getOrderTotal(selectedOrder) * 0.18)
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-neutral-100 px-6 py-4 flex-shrink-0">
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <p className="text-slate-500 text-sm font-medium">
                      Need help?{" "}
                      <a
                        href="/contact"
                        className="text-primary-hover hover:underline"
                      >
                        Contact us
                      </a>
                    </p>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default UserOrderPage;
