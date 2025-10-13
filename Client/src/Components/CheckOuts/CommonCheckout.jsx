import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { State, City } from "country-state-city";
import { createPaymentOrder, initializePayment } from "../../utils/paymentUtils";

const CommonCheckout = () => {
  const { id: cartItemId } = useParams();
  const navigate = useNavigate(); // ✅ Initialize navigate
  console.log("🟡 Checkout param ID:", cartItemId);

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
      alert("Please enter your full name");
      return false;
    }

    if (!phoneRegex.test(form.phone)) {
      alert("Please enter a valid 10-digit Indian mobile number");
      return false;
    }

    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    if (!form.address.trim()) {
      alert("Please enter your delivery address");
      return false;
    }

    if (!form.state) {
      alert("Please select a state");
      return false;
    }

    if (!form.city) {
      alert("Please select a city");
      return false;
    }

    if (!pincodeRegex.test(form.pincode)) {
      alert("Please enter a valid 6-digit pincode");
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
        alert("Please log in to proceed");
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
        fd.append("deliveryDetails", JSON.stringify({
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
        }));

        await axiosInstance.post("/orders", fd);
        alert("✅ Order placed with Cash on Delivery.");
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
        await initializePayment(orderData, form);
        // Note: Navigation will be handled by payment success handler
      }
      
    } catch (error) {
      console.error("Payment failed:", error);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!cartItem) return <div className="p-8 text-center">Item not found</div>;

  const product = cartItem.productId || {};

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
      {/* Left: Product Details */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <img
          src={cartItem.uploadedImageUrl || cartItem.image || product.image}
          alt="Product"
          className="w-full h-80 object-contain border rounded"
        />
        <h2 className="text-2xl font-bold">{cartItem.title}</h2>
        <p>Size: {cartItem.size}</p>
        <p>Thickness: {cartItem.thickness}</p>
        <p>Quantity: {cartItem.quantity}</p>
        <div className="mt-2 pt-2 border-t">
          <div className="flex justify-between text-gray-700">
            <span>Items Total</span>
            <span className="font-medium">₹{Number(cartItem.totalAmount || cartItem.price || 0)}</span>
          </div>
          <div className="flex justify-between text-gray-700">
            <span>Shipping</span>
            <span className="font-medium">₹{SHIPPING_CHARGE}</span>
          </div>
          <div className="flex justify-between text-green-700 text-lg font-semibold">
            <span>Grand Total</span>
            <span>₹{Number(cartItem.totalAmount || cartItem.price || 0) + SHIPPING_CHARGE}</span>
          </div>
        </div>
      </div>

      {/* Right: User Form */}
      <div className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="text-xl font-semibold mb-2">Delivery Information</h3>

        <input
          name="name"
          placeholder="Full Name *"
          value={form.name}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          name="email"
          placeholder="Email *"
          type="email"
          value={form.email}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <div className="flex">
          <span className="px-4 py-2 bg-gray-100 border border-r-0 rounded-l">
            +91
          </span>
          <input
            name="phone"
            placeholder="Phone Number *"
            type="tel"
            value={form.phone}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-l-0 rounded-r"
            required
          />
        </div>

        <textarea
          name="address"
          placeholder="Delivery Address *"
          rows={3}
          value={form.address}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        {/* State / District / City */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* State */}
          <select
            required
            value={form.stateCode}
            onChange={(e) => {
              const code = e.target.value;
              const st = statesList.find((s) => s.isoCode === code);
              setForm((prev) => ({ ...prev, stateCode: code, state: st?.name || "", district: "", city: "" }));
            }}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select State</option>
            {statesList.map((st) => (
              <option key={st.isoCode} value={st.isoCode}>{st.name}</option>
            ))}
          </select>

          {/* District (optional) */}
          <input
            name="district"
            placeholder="District (optional)"
            value={form.district}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            disabled={!form.stateCode}
          />

          {/* City */}
          <select
            required
            value={form.city}
            onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
            disabled={!form.stateCode}
          >
            <option value="">Select City</option>
            {citiesList.map((c) => (
              <option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <input
          name="pincode"
          placeholder="Pincode *"
          value={form.pincode}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border rounded"
          required
        />

        {/* Payment Method */}
        <div className="mt-1">
          <p className="font-medium mb-2">Payment Method</p>
          <div className="flex items-center gap-4">
            <label className={`flex items-center gap-2 px-3 py-2 rounded border ${paymentMethod === 'ONLINE' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "ONLINE"}
                onChange={() => setPaymentMethod("ONLINE")}
              />
              <span>Online (Razorpay)</span>
            </label>
            <label className={`flex items-center gap-2 px-3 py-2 rounded border ${paymentMethod === 'COD' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300'}`}>
              <input
                type="radio"
                name="paymentMethod"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              <span>Cash on Delivery (COD)</span>
            </label>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={paymentLoading}
          className={`w-full py-3 rounded text-lg font-bold ${
            paymentLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {paymentLoading ? "Processing Payment..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default CommonCheckout;
