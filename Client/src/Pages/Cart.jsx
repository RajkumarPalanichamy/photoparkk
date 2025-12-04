import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  X,
  ShoppingBag,
  Truck,
  Shield,
  Sparkles,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, loading, removeFromCart, clearCart, fetchCartData } =
    useCart();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      JSON.parse(user);
    } catch {
      navigate("/login");
      return;
    }

    fetchCartData();
  }, [navigate, fetchCartData]);

  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      toast.error("Failed to remove item from cart");
      console.error("Error removing item:", result.error);
    } else {
      toast.success("Item removed from cart");
    }
  };

  const handleClearCart = async () => {
    if (
      window.confirm("Are you sure you want to clear all items from your cart?")
    ) {
      const result = await clearCart();
      if (!result.success) {
        toast.error("Failed to clear cart");
        console.error("Error clearing cart:", result.error);
      } else {
        toast.success("Cart cleared successfully");
      }
    }
  };

  const getCheckoutLink = (item) => `/checkout/${item._id}`;
  const formatDate = (isoDate) =>
    new Date(isoDate).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // Process cart items for display
  const processedItems = (cartItems || []).map((item) => {
    const product = item.productId || {};
    const unitPrice = item.price || 0;
    const quantity = item.quantity || 1;
    const totalPrice = unitPrice * quantity;

    return {
      _id: item._id,
      productId: product?._id || null,
      name: product?.title || item.title || "Custom Product",
      image: item.uploadedImageUrl || item.image || product?.image || "",
      size: item.size || "N/A",
      thickness: item.thickness || "N/A",
      price: unitPrice,
      quantity,
      totalPrice,
      productType: item.productType || "Unknown",
      createdAt: item.createdAt || new Date().toISOString(),
    };
  });

  const sortedItems = processedItems.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const grouped = {};
  sortedItems.forEach((item) => {
    const dateKey = new Date(item.createdAt).toISOString().split("T")[0];
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(item);
  });

  const total = sortedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = sortedItems.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Shopping Cart
              </h1>
              <p className="text-gray-600 mt-1">
                {itemCount > 0
                  ? `${itemCount} ${
                      itemCount === 1 ? "item" : "items"
                    } in your cart`
                  : "Your cart is empty"}
              </p>
            </div>
          </div>
        </div>

        {Object.keys(grouped).length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="text-center py-20 px-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start
                shopping to add items!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/shop/acrylic"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Products
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-indigo-500 text-gray-700 hover:text-indigo-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                >
                  <ArrowRight className="w-5 h-5" />
                  Go to Home
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {Object.entries(grouped).map(([date, items]) => (
                <div
                  key={date}
                  className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-white" />
                      <h3 className="text-lg font-bold text-white">
                        Added on {formatDate(date)}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item._id}
                        className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-300 group"
                      >
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/200?text=No+Image";
                            }}
                          />
                          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Size:</span>
                              <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                                {item.size}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Thickness:</span>
                              <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-700">
                                {item.thickness}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Type:</span>
                              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-medium">
                                {item.productType}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-gray-500">
                                Unit Price
                              </p>
                              <p className="text-base font-semibold text-gray-700">
                                ₹{item.price}
                              </p>
                            </div>
                            <div className="border-l border-gray-300 pl-4">
                              <p className="text-xs text-gray-500">Total</p>
                              <p className="text-xl font-bold text-indigo-600">
                                ₹{item.totalPrice}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row sm:flex-col gap-2 sm:items-end">
                          <Link
                            to={getCheckoutLink(item)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Checkout
                          </Link>
                          <button
                            onClick={() => handleRemove(item._id)}
                            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Order Summary
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Item Count */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Items</span>
                    <span className="text-gray-900 font-bold text-lg">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Subtotal</span>
                    <span className="text-gray-900 font-semibold">
                      ₹{total}
                    </span>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">
                          Free Shipping
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                          Estimated delivery in 4-7 working days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          Secure Checkout
                        </p>
                        <p className="text-xs text-blue-700 mt-1">
                          100% Secure Payment & Satisfaction Guaranteed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t-2 border-gray-300">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xl font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-3xl font-bold text-indigo-600">
                        ₹{total}
                      </span>
                    </div>

                    {/* Clear Cart Button */}
                    <button
                      onClick={handleClearCart}
                      className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300 mb-4"
                    >
                      <Trash2 className="w-5 h-5" />
                      Clear Cart
                    </button>

                    {/* Continue Shopping */}
                    <Link
                      to="/shop/acrylic"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-indigo-500 hover:bg-indigo-50 text-indigo-600 px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      <ArrowRight className="w-5 h-5" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
