import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { State, City } from "country-state-city";
import {
  createPaymentOrder,
  initializePayment,
} from "../../utils/paymentUtils";
import {
  ShoppingCart,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Shield,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

const CommonCheckout = () => {
  const { id: cartItemId } = useParams();
  const navigate = useNavigate();

  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    stateCode: "",
    district: "",
    city: "",
    pincode: "",
  });

  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);

  const SHIPPING_CHARGE = 100;

  useEffect(() => {
    const fetchCartItem = async () => {
      try {
        const { data } = await axiosInstance.get(`/cart/${cartItemId}`);
        setCartItem(data);
      } catch (error) {
        console.error("Error fetching cart item:", error);
        toast.error("Failed to load cart item");
      } finally {
        setLoading(false);
      }
    };
    fetchCartItem();
  }, [cartItemId]);

  // Load India states on mount
  useEffect(() => {
    const allStates = State.getStatesOfCountry("IN") || [];
    setStatesList(allStates);
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (!form.stateCode) {
      setCitiesList([]);
      return;
    }
    const allCities = City.getCitiesOfState("IN", form.stateCode) || [];
    setCitiesList(allCities);
  }, [form.stateCode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pincodeRegex = /^\d{6}$/;

    if (!form.name.trim()) {
      toast.error("Please enter your full name");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      toast.error("Please enter a valid 10-digit Indian mobile number");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!form.address.trim()) {
      toast.error("Please enter your delivery address");
      return false;
    }

    if (!form.state) {
      toast.error("Please select a state");
      return false;
    }

    if (!form.city) {
      toast.error("Please select a city");
      return false;
    }

    if (!pincodeRegex.test(form.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setPaymentLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        toast.error("Please log in to proceed");
        navigate("/login");
        return;
      }

      // Calculate total amount + shipping
      const itemsTotal = Number(cartItem.totalAmount || cartItem.price || 0);
      const totalAmount = itemsTotal + SHIPPING_CHARGE;

      if (paymentMethod === "COD") {
        // Create regular order directly via /orders (multipart/form-data)
        const fd = new FormData();
        fd.append("cartItemId", cartItem._id);
        fd.append("productType", cartItem.productType || "custom");
        fd.append("amount", String(totalAmount));
        fd.append(
          "deliveryDetails",
          JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            address: form.address,
            state: form.state,
            district: form.district,
            city: form.city,
            pincode: form.pincode,
            shippingCharge: SHIPPING_CHARGE,
            itemsTotal,
          })
        );

        await axiosInstance.post("/orders", fd);
        toast.success("Order placed successfully with Cash on Delivery!");
        navigate("/my-orders");
      } else {
        // Online payment via Razorpay
        const paymentData = {
          amount: totalAmount,
          cartItemId: cartItem._id,
          productType: cartItem.productType || "custom",
          deliveryDetails: {
            ...form,
            shippingCharge: SHIPPING_CHARGE,
            itemsTotal,
          },
        };

        const orderData = await createPaymentOrder(paymentData);
        // Note: initializePayment opens Razorpay modal and handles payment
        // Navigation will be handled by payment success handler in paymentUtils
        try {
          await initializePayment(orderData, form);
        } catch (paymentError) {
          // Handle payment cancellation or initialization errors
          if (paymentError.message === "Payment cancelled by user") {
            // User closed the modal - don't show error, just reset loading
            console.log("Payment cancelled by user");
            setPaymentLoading(false);
            return; // Exit early, don't show error
          }
          // Re-throw other errors to be caught by outer catch
          throw paymentError;
        }
      }
    } catch (error) {
      console.error("Payment failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Payment failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (!cartItem) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-secondary mb-2">
            Item not found
          </h3>
          <p className="text-neutral-600 mb-6">
            The cart item you're looking for doesn't exist.
          </p>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Cart
          </Link>
        </div>
      </div>
    );
  }

  const product = cartItem.productId || {};
  const itemsTotal = Number(cartItem.totalAmount || cartItem.price || 0);
  const totalAmount = itemsTotal + SHIPPING_CHARGE;

  return (
    <div className="min-h-screen bg-neutral-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary">
                Checkout
              </h1>
              <p className="text-neutral-600 mt-1">
                Complete your order details and payment
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Delivery Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Delivery Information
                </h2>
              </div>

              <div className="p-6 space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      name="name"
                      placeholder="Enter your full name"
                      value={form.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                    <input
                      name="email"
                      placeholder="your.email@example.com"
                      type="email"
                      value={form.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <div className="flex items-center px-4 bg-neutral-100 border-2 border-r-0 border-neutral-300 rounded-l-xl">
                      <span className="text-neutral-700 font-medium">+91</span>
                    </div>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        name="phone"
                        placeholder="10-digit mobile number"
                        type="tel"
                        value={form.phone}
                        onChange={handleInputChange}
                        maxLength={10}
                        className="w-full pl-10 pr-4 py-3 border-2 border-l-0 border-neutral-300 rounded-r-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                    <textarea
                      name="address"
                      placeholder="Enter your complete delivery address"
                      rows={3}
                      value={form.address}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition resize-none"
                      required
                    />
                  </div>
                </div>

                {/* State / District / City */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      State <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.stateCode}
                      onChange={(e) => {
                        const code = e.target.value;
                        const st = statesList.find((s) => s.isoCode === code);
                        setForm((prev) => ({
                          ...prev,
                          stateCode: code,
                          state: st?.name || "",
                          district: "",
                          city: "",
                        }));
                      }}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
                    >
                      <option value="">Select State</option>
                      {statesList.map((st) => (
                        <option key={st.isoCode} value={st.isoCode}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      District
                    </label>
                    <input
                      name="district"
                      placeholder="District (optional)"
                      value={form.district}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition disabled:bg-neutral-100 disabled:cursor-not-allowed"
                      disabled={!form.stateCode}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={form.city}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition disabled:bg-neutral-100 disabled:cursor-not-allowed"
                      disabled={!form.stateCode}
                    >
                      <option value="">Select City</option>
                      {citiesList.map((c) => (
                        <option
                          key={`${c.name}-${c.latitude}-${c.longitude}`}
                          value={c.name}
                        >
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="pincode"
                    placeholder="6-digit pincode"
                    value={form.pincode}
                    onChange={handleInputChange}
                    maxLength={6}
                    className="w-full px-4 py-3 border-2 border-neutral-300 rounded-xl focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-6 h-6" />
                  Payment Method
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("ONLINE")}
                    className={`p-5 rounded-xl border-2 transition-all duration-300 ${
                      paymentMethod === "ONLINE"
                        ? "border-primary bg-primary-light shadow-lg scale-105"
                        : "border-neutral-300 hover:border-primary-light hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "ONLINE"
                            ? "border-primary bg-primary-light0"
                            : "border-neutral-300"
                        }`}
                      >
                        {paymentMethod === "ONLINE" && (
                          <div className="w-2 h-2 rounded-full bg-white" />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <span className="font-bold text-secondary">
                            Online Payment
                          </span>
                        </div>
                        <p className="text-sm text-neutral-600">
                          Razorpay (Cards, UPI, Net Banking)
                        </p>
                      </div>
                    </div>
                  </button>

                </div>

                {paymentMethod === "ONLINE" && (
                  <div className="mt-4 p-4 bg-primary-light border border-primary-light rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-secondary">
                          Secure Payment
                        </p>
                        <p className="text-xs text-primary-hover mt-1">
                          Your payment is processed securely through Razorpay.
                          We never store your card details.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden sticky top-8">
              <div className="bg-primary px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Order Summary
                </h3>
              </div>

              <div className="p-6 space-y-6">
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={
                      cartItem.uploadedImageUrl ||
                      cartItem.image ||
                      product.image ||
                      "https://via.placeholder.com/400?text=No+Image"
                    }
                    alt="Product"
                    className="w-full h-64 object-contain bg-neutral-50 rounded-xl border border-neutral-200"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400?text=No+Image";
                    }}
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-3 pb-4 border-b border-neutral-200">
                  <h4 className="text-lg font-bold text-secondary">
                    {cartItem.title || product.title || "Custom Product"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Size:</span>
                      <span className="font-semibold text-secondary">
                        {cartItem.size || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Thickness:</span>
                      <span className="font-semibold text-secondary">
                        {cartItem.thickness || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-600">Quantity:</span>
                      <span className="font-semibold text-secondary">
                        {cartItem.quantity || 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pb-4 border-b border-neutral-200">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Items Total</span>
                    <span className="font-semibold text-secondary">
                      ₹{itemsTotal}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-semibold text-secondary">
                      ₹{SHIPPING_CHARGE}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t-2 border-neutral-300">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xl font-bold text-secondary">
                      Grand Total
                    </span>
                    <span className="text-3xl font-bold text-primary">
                      ₹{totalAmount}
                    </span>
                  </div>

                  {/* Payment Button */}
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {paymentLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        <span>
                          {paymentMethod === "COD"
                            ? "Place Order"
                            : "Pay ₹" + totalAmount}
                        </span>
                      </>
                    )}
                  </button>
                </div>

                {/* Security Info */}
                <div className="bg-success-light border border-success rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-success">
                        Secure Checkout
                      </p>
                      <p className="text-xs text-success mt-1">
                        100% Secure Payment & Satisfaction Guaranteed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonCheckout;
