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
  const {
    cartItems,
    loading,
    removeFromCart,
    updateQuantity,
    clearCart,
    fetchCartData,
  } = useCart();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleRemove = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      toast.error("Failed to remove item from cart");
      console.error("Error removing item:", result.error);
    } else {
      toast.success("Item removed from cart");
    }
  };

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    if (newQuantity === currentQuantity) return;

    const result = await updateQuantity(itemId, newQuantity);
    if (!result.success) {
      toast.error("Failed to update quantity");
      console.error("Error updating quantity:", result.error);
    }
  };

  const handleCheckoutAll = () => {
    if (sortedItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    // Navigate to checkout with first item, or create a bulk checkout route
    // For now, we'll use the first item's checkout link
    navigate(`/checkout/${sortedItems[0]._id}`);
  };

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

  const total = sortedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = sortedItems.length;

  if (loading) {
    return (
      <div className="bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 pt-[100px] pb-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary">
                Shopping Cart
              </h1>
              <p className="text-neutral-600 mt-1">
                {itemCount > 0
                  ? `${itemCount} ${
                      itemCount === 1 ? "item" : "items"
                    } in your cart`
                  : "Your cart is empty"}
              </p>
            </div>
          </div>
        </div>

        {sortedItems.length === 0 ? (
          /* Empty Cart State */
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="text-center py-20 px-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary rounded-full mb-6">
                <ShoppingBag className="w-12 h-12 text-neutral-400" />
              </div>
              <h3 className="text-3xl font-bold text-secondary mb-3">
                Your cart is empty
              </h3>
              <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added anything to your cart yet. Start
                shopping to add items!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/shop/acrylic"
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Sparkles className="w-5 h-5" />
                  Browse Products
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center gap-2 bg-white border-2 border-neutral-300 hover:border-primary text-neutral-700 hover:text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300"
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
              {sortedItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200 hover:border-primary-light transition-all duration-300 group">
                      {/* Product Image */}
                      <div className="relative flex-shrink-0 mx-auto sm:mx-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-28 sm:w-32 sm:h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/200?text=No+Image";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-lg font-bold text-secondary mb-2 line-clamp-2">
                            {item.name}
                          </h4>
                          <div className="space-y-1.5 mb-3">
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <span className="font-medium">Size:</span>
                              <span className="bg-neutral-200 px-2 py-0.5 rounded text-neutral-700">
                                {item.size}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <span className="font-medium">Thickness:</span>
                              <span className="bg-neutral-200 px-2 py-0.5 rounded text-neutral-700">
                                {item.thickness}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-600">
                              <span className="font-medium">Type:</span>
                              <span className="bg-primary-light text-primary-hover px-2 py-0.5 rounded font-medium">
                                {item.productType}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-4">
                          <div>
                            <p className="text-xs text-neutral-500">
                              Unit Price
                            </p>
                            <p className="text-base font-semibold text-neutral-700">
                              ₹{item.price}
                            </p>
                          </div>
                          <div className="border-l border-neutral-300 pl-4">
                            <p className="text-xs text-neutral-500">Total</p>
                            <p className="text-xl font-bold text-primary">
                              ₹{item.totalPrice}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls and Delete */}
                      <div className="flex flex-row sm:flex-col gap-3 sm:items-center sm:justify-center">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-0 border border-neutral-300 rounded-lg bg-white">
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity, -1)
                            }
                            disabled={item.quantity <= 1}
                            className="p-2 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg"
                          >
                            <Minus className="w-4 h-4 text-neutral-700" />
                          </button>
                          <span className="px-4 py-2 text-base font-semibold text-secondary min-w-[3.5rem] text-center border-x border-neutral-300">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, item.quantity, 1)
                            }
                            className="p-2 hover:bg-neutral-100 transition-colors rounded-r-lg"
                          >
                            <Plus className="w-4 h-4 text-neutral-700" />
                          </button>
                        </div>
                        {/* Delete Icon */}
                        <button
                          onClick={() => handleRemove(item._id)}
                          className="p-2 text-error hover:bg-error-light rounded-lg transition-colors flex items-center justify-center"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden sticky top-[100px]">
                <div className="bg-primary px-6 py-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Order Summary
                  </h3>
                </div>

                <div className="p-6 space-y-6">
                  {/* Item Count */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                    <span className="text-neutral-600 font-medium">Items</span>
                    <span className="text-secondary font-bold text-lg">
                      {itemCount} {itemCount === 1 ? "item" : "items"}
                    </span>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                    <span className="text-neutral-600 font-medium">
                      Subtotal
                    </span>
                    <span className="text-secondary font-semibold">
                      ₹{total}
                    </span>
                  </div>

                  {/* Shipping Info */}
                  <div className="bg-success-light border border-success rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Truck className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-success">
                          Free Shipping
                        </p>
                        <p className="text-xs text-success mt-1">
                          Estimated delivery in 4-7 working days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Security Info */}
                  <div className="bg-primary-light border border-primary-light rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-secondary">
                          Secure Checkout
                        </p>
                        <p className="text-xs text-primary-hover mt-1">
                          100% Secure Payment & Satisfaction Guaranteed
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="pt-4 border-t-2 border-neutral-300">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xl font-bold text-secondary">
                        Total
                      </span>
                      <span className="text-3xl font-bold text-primary">
                        ₹{total}
                      </span>
                    </div>

                    {/* Checkout All Button */}
                    <button
                      onClick={handleCheckoutAll}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-4"
                    >
                      <ArrowRight className="w-5 h-5" />
                      Checkout
                    </button>

                    {/* Continue Shopping */}
                    <Link
                      to="/shop/acrylic"
                      className="w-full inline-flex items-center justify-center gap-2 bg-white border-2 border-primary hover:bg-primary-light text-primary px-6 py-3 rounded-xl font-semibold transition-all duration-300"
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
