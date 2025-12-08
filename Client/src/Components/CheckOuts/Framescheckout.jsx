import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { State, City } from "country-state-city";
import {
  createPaymentOrder,
  initializePayment,
} from "../../utils/paymentUtils";

const Framescheckout = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [userId, setUserId] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("ONLINE");
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Load states and dependent cities (India)
  useEffect(() => {
    const allStates = State.getStatesOfCountry("IN") || [];
    setStatesList(allStates);
  }, []);

  useEffect(() => {
    if (!stateCode) {
      setCitiesList([]);
      return;
    }
    const allCities = City.getCitiesOfState("IN", stateCode) || [];
    setCitiesList(allCities);
  }, [stateCode]);

  useEffect(() => {
    const stored = sessionStorage.getItem("checkoutFrameData");

    if (stored) {
      const parsedData = JSON.parse(stored);
      console.log("✅ checkoutFrameData from sessionStorage:", parsedData);
      console.log("🖼️ Frame Image URL:", parsedData.frameImageUrl);
      console.log("🎨 Selected Color:", parsedData.color);
      setCheckoutData(parsedData);
    }

    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user._id) {
      setUserId(user._id);
    }
  }, []);

  if (!userId) {
    return (
      <div className="text-center text-error p-10 text-xl">
        ⚠️ Please log in to proceed with checkout.
      </div>
    );
  }

  if (!checkoutData)
    return <div className="text-center p-10 text-xl">No data found.</div>;

  const {
    shape = "",
    color = "",
    size = "",
    price = 0,
    quantity = 1,
    title = "",
    frameImageUrl = "",
    userImageUrl = "",
  } = checkoutData || {};

  const SHIPPING_CHARGE = 100;
  const itemsTotal = Number(price) * Number(quantity);

  const validateForm = () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const pincodeRegex = /^\d{6}$/;

    if (!fullName.trim()) {
      alert("👤 Full name is required.");
      return false;
    }

    if (!phoneRegex.test(phone)) {
      alert("📱 Enter a valid 10-digit Indian mobile number.");
      return false;
    }

    if (!emailRegex.test(email)) {
      alert("📧 Only Gmail addresses are accepted (e.g., example@gmail.com).");
      return false;
    }

    if (!address.trim()) {
      alert("📦 Address is required.");
      return false;
    }

    if (!stateName) {
      alert("🗺️ Please select a state.");
      return false;
    }

    if (!city) {
      alert("🌆 Please select a city.");
      return false;
    }

    if (!pincodeRegex.test(pincode)) {
      alert("📍 Enter a valid 6-digit area pincode.");
      return false;
    }

    return true;
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setPaymentLoading(true);
    const itemsTotal = Number(price) * Number(quantity);
    const totalAmount = itemsTotal + SHIPPING_CHARGE;

    try {
      const paymentData = {
        amount: totalAmount,
        cartItemId: null,
        productType: "frame",
        deliveryDetails: {
          name: fullName,
          email,
          phone: `+91${phone}`,
          address,
          state: stateName,
          district,
          city,
          pincode,
        },
      };

      const orderPayload = {
        userId,
        shippingDetails: {
          fullName,
          phone: `+91${phone}`,
          email,
          address,
          state: stateName,
          district,
          city,
          pincode,
        },
        items: [
          {
            title,
            shape,
            color,
            size,
            quantity,
            price,
            total: itemsTotal,
            frameImageUrl,
            userImageUrl,
          },
        ],
        status: paymentMethod === "COD" ? "COD Pending" : "Pending",
        shippingCharge: SHIPPING_CHARGE,
        grandTotal: totalAmount,
      };

      console.log("📝 Creating payment with order:", orderPayload);

      if (paymentMethod === "COD") {
        // Create frame order directly, skip Razorpay
        await axiosInstance.post('/frameorders/create', orderPayload);
        alert("✅ Order placed with Cash on Delivery.");
        // Navigate to orders page after COD
        window.location.href = '/my-orders';
      } else {
        try {
          const orderData = await createPaymentOrder(paymentData);
          // Pass orderPayload to initializePayment
          orderData.orderPayload = orderPayload;
          await initializePayment(orderData, {
            name: fullName,
            email,
            phone: `+91${phone}`,
            address,
          });
        } catch (paymentError) {
          console.error('❌ Payment initialization failed:', paymentError);
          alert('❌ Payment initialization failed. Please try again.');
          return;
        }
      }

      // Order will be created in payment success handler
      if (paymentMethod !== "COD") {
        alert("✅ Payment successful! Your frame order has been placed.");
      }
      sessionStorage.removeItem("checkoutFrameData");
      setFullName("");
      setPhone("");
      setEmail("");
      setAddress("");
      setStateName("");
      setDistrict("");
      setCity("");
      setPincode("");
    } catch (error) {
      console.error("❌ Payment or Order saving failed:", error);
      alert("❌ Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-6">
      {/* Frame Preview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 md:sticky md:top-6 md:h-fit">
        <h2 className="text-2xl font-semibold mb-4 text-center text-secondary">
          🖼️ Frame Preview
        </h2>
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-neutral-100 text-secondary">
            {color} Frame
          </span>
        </div>
        <div className="mb-6 flex justify-center">
          <div className={`inline-block border-[10px] rounded-2xl p-1 bg-white shadow-sm ${
            color.toLowerCase() === 'black' ? 'border-black' :
            color.toLowerCase() === 'white' ? 'border-neutral-300' :
            color.toLowerCase() === 'brown' ? 'border-warning' :
            color.toLowerCase() === 'gold' ? 'border-yellow-500' :
            color.toLowerCase() === 'silver' ? 'border-neutral-neutral-400' :
            color.toLowerCase() === 'blue' ? 'border-primary' :
            color.toLowerCase() === 'red' ? 'border-error' :
            color.toLowerCase() === 'green' ? 'border-success' :
            color.toLowerCase() === 'purple' ? 'border-primary' :
            color.toLowerCase() === 'pink' ? 'border-primary' :
            color.toLowerCase() === 'orange' ? 'border-primary' :
            'border-neutral-300'
          }`}>
            <img
              src={userImageUrl}
              alt="User"
              className="w-64 h-64 object-cover rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-3 text-base text-neutral-700">
          <div className="grid grid-cols-2 gap-y-2">
            <span className="font-medium text-neutral-500">Shape</span>
            <span className="text-secondary">{shape}</span>
            <span className="font-medium text-neutral-500">Color</span>
            <span className="text-secondary">{color}</span>
            <span className="font-medium text-neutral-500">Title</span>
            <span className="text-secondary">{title}</span>
            <span className="font-medium text-neutral-500">Size</span>
            <span className="text-secondary">{size}</span>
            <span className="font-medium text-neutral-500">Quantity</span>
            <span className="text-secondary">{quantity}</span>
            <span className="font-medium text-neutral-500">Price / Unit</span>
            <span className="text-secondary">₹{price}</span>
          </div>

          <div className="mt-4 border-t border-neutral-200 pt-4 space-y-2">
            <div className="flex justify-between text-neutral-700">
              <span>Items Total</span>
              <span className="font-medium">₹{itemsTotal}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span>Shipping</span>
              <span className="font-medium">₹{SHIPPING_CHARGE}</span>
            </div>
            <div className="flex justify-between text-secondary text-lg font-semibold">
              <span>Grand Total</span>
              <span>₹{itemsTotal + SHIPPING_CHARGE}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Shipping Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
        <h2 className="text-2xl font-semibold mb-6 text-center text-secondary">
          📝 Shipping Details
        </h2>

        <form onSubmit={handlePayment} className="space-y-4">
          <label className="block text-sm font-medium text-neutral-700">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full border p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
          />
          <label className="block text-sm font-medium text-neutral-700">Phone</label>
          <div className="flex">
            <span className="px-4 py-2 bg-neutral-100 border border-r-0 rounded-l-lg text-neutral-600">
              +91
            </span>
            <input
              type="tel"
              required
              pattern="[6-9]{1}[0-9]{9}"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit Mobile Number"
              className="w-full px-4 py-2 border border-l-0 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
            />
          </div>
          <label className="block text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            required
            pattern="^[a-zA-Z0-9._%+\-]+@gmail\.com$"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (Gmail only)"
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
          />

          <label className="block text-sm font-medium text-neutral-700">Address</label>
          <textarea
            required
            rows={3}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
          />
          {/* State / District / City */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* State */}
            <label className="sr-only">State</label>
            <select
              required
              value={stateCode}
              onChange={(e) => {
                const code = e.target.value;
                setStateCode(code);
                const st = statesList.find((s) => s.isoCode === code);
                setStateName(st?.name || "");
                setDistrict("");
                setCity("");
              }}
              className="w-full border p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
            >
              <option value="">Select State</option>
              {statesList.map((st) => (
                <option key={st.isoCode} value={st.isoCode}>{st.name}</option>
              ))}
            </select>

            {/* District (optional text) */}
            <label className="sr-only">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District (optional)"
              className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary disabled:bg-neutral-100"
              disabled={!stateCode}
            />

            {/* City */}
            <label className="sr-only">City</label>
            <select
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full border p-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary disabled:bg-neutral-100"
              disabled={!stateCode}
            >
              <option value="">Select City</option>
              {citiesList.map((c) => (
                <option key={`${c.name}-${c.latitude}-${c.longitude}`} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <label className="block text-sm font-medium text-neutral-700">
            Pincode
            {pincode.length === 6 && /^\d{6}$/.test(pincode) && (
              <span className="ml-2 text-success text-xs">✓ Valid</span>
            )}
          </label>
          <input
            type="text"
            required
            pattern="[0-9]{6}"
            maxLength={6}
            value={pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
              setPincode(value);
            }}
            placeholder="Enter 6-digit pincode"
            className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-light focus:border-primary"
          />

          {/* Payment Method */}
          <div className="mt-2">
            <p className="font-medium mb-2 text-secondary">Payment Method</p>
            <div className="flex items-center gap-4">
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-primary bg-primary-light text-primary-hover`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  className="accent-blue-600"
                  checked={true}
                  readOnly
                />
                <span>Online (Razorpay)</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={paymentLoading}
            className={`w-full py-3 rounded-lg shadow-sm transition-colors ${
              paymentLoading ? "bg-neutral-300 text-neutral-700" : "bg-primary hover:bg-primary-hover text-white"
            }`}
          >
            {paymentLoading ? "Processing..." : "🛒 Pay Now"}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Framescheckout;
