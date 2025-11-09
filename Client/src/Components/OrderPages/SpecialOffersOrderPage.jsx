// SpecialOffersOrderPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaPhoneAlt,
  FaStar,
  FaUpload,
  FaShieldAlt,
  FaTruck,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import {
  CONTACT_TEL_LINK,
  CONTACT_WHATSAPP_LINK,
} from "../../constants/contact";

const SpecialOffersOrderPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedThickness, setSelectedThickness] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser._id);
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err);
      }
    }

    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/specialoffers/${id}`);
        const data = res.data;
        setProduct(data);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.thickness) setSelectedThickness(data.thickness);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageAndGetUrl = async () => {
    if (!uploadedImage) return null;
    const formData = new FormData();
    formData.append("image", uploadedImage);
    try {
      const res = await axiosInstance.post("/cart/api/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.imageUrl;
    } catch (error) {
      alert("Image upload failed. Please try again.");
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedThickness)
      return alert("Please select size and thickness.");
    if (quantity < 1) return alert("Quantity must be at least 1.");
    if (!uploadedImage) return alert("Please upload your image.");
    if (!userId) return alert("Please log in first.");

    setLoading(true);
    try {
      const uploadedImageUrl = await uploadImageAndGetUrl();
      if (!uploadedImageUrl) return;

      const cartData = {
        userId,
        productId: product._id,
        productType: "SpecialOffersdata",
        title: product.title,
        quantity,
        size: selectedSize.label,
        thickness: selectedThickness,
        price: selectedSize.price,
        totalAmount: selectedSize.price * quantity,
        image: uploadedImageUrl,
      };

      await axiosInstance.post("/cart", cartData);
      alert("✅ Item added to cart!");
      navigate("/cart");
    } catch (error) {
      alert("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  const checkDelivery = () => {
    if (!/^\d{6}$/.test(pincode)) {
      setError("Please enter a valid 6-digit pincode.");
      setDeliveryStatus(null);
      return;
    }
    setError("");
    const serviceablePincodes = [
      "600001",
      "110001",
      "560001",
      "994077",
      "638459",
    ];
    setDeliveryStatus(
      serviceablePincodes.includes(pincode) ? "Available" : "Unavailable"
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
        Product not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top Grid - 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column - Image Upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Upload Your Photo
              </h2>
              <p className="text-gray-600">Ordered as Same material</p>
            </div>

            {/* Upload Area */}
            <div className="mb-6">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center">
                  <FaUpload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500 font-medium">
                    Click to upload your photo
                  </p>
                  <p className="text-sm text-gray-400 mt-1">PNG, JPG, JPEG</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview */}
            <div className="rounded-lg overflow-hidden bg-gray-50 p-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-72 object-contain rounded-lg"
                />
              ) : (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-72 object-contain rounded-lg"
                />
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Product Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                {product.title}
              </h1>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < Math.round(product.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 text-sm">
                    ({product.rating}/5)
                  </span>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Quality Checked
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-orange-500">
                    ₹{selectedSize?.price || "0"}
                  </span>
                  {selectedSize?.original && (
                    <span className="text-xl text-gray-400 line-through">
                      ₹{selectedSize.original}
                    </span>
                  )}
                </div>
                {selectedSize?.original && (
                  <div className="text-green-600 text-sm font-medium mt-1">
                    Free Shipping Included
                  </div>
                )}
              </div>

              {/* Urgency Badge */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-red-700 text-sm font-medium">
                    ⏰ Hurry! Only a few pieces left at this price.
                  </span>
                </div>
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Select Size
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.sizes?.map((sizeObj, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSize(sizeObj)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedSize?.label === sizeObj.label
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900">
                      {sizeObj.label}
                    </div>
                    <div className="text-orange-500 font-semibold">
                      ₹{sizeObj.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness Selection */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-gray-900 mb-3">
                Select Thickness
              </label>
              <div className="flex flex-wrap gap-3">
                {(Array.isArray(product.thickness)
                  ? product.thickness
                  : [product.thickness]
                ).map((thick, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedThickness(thick)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                      selectedThickness === thick
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {thick}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & CTA */}
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                <span className="font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <FaShoppingCart />
                {loading ? "Adding to Cart..." : "Add to Cart"}
              </button>

              {/* Trust Badges */}
              <div className="flex justify-center gap-6 text-center text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaTruck />
                  <span>4-7 Days Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaShieldAlt />
                  <span>Secure Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Highlights */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
              HIGHLIGHTS
            </h3>
            <ul className="space-y-3">
              {(
                product.highlights || [
                  "Premium Quality Material",
                  "Customizable Design",
                  "Secure Packaging",
                  "Fast Delivery",
                  "Eco-Friendly Process",
                ]
              ).map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bulk Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                BULK ORDERS
              </h3>
              <p className="text-orange-600 font-medium mb-1">
                Amazing Deals Available!
              </p>
              <p className="text-gray-600 text-sm">
                Perfect for Gifts and Events
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => (window.location.href = CONTACT_TEL_LINK)}
                className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3"
              >
                <FaPhoneAlt />
                Call for Bulk Orders
              </button>
              <button
                onClick={() => window.open(CONTACT_WHATSAPP_LINK, "_blank")}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-3"
              >
                <FaPhoneAlt />
                WhatsApp Bulk Orders
              </button>
            </div>
          </div>

          {/* Delivery Checker */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 text-blue-600 mb-2">
                <FaMapMarkerAlt className="text-lg" />
                <h3 className="text-xl font-bold">CHECK DELIVERY</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Enter your pincode to check availability
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex max-w-xs mx-auto">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter pincode"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  maxLength={6}
                />
                <button
                  onClick={checkDelivery}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg font-semibold transition-colors text-sm"
                >
                  Check
                </button>
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium text-center">
                  {error}
                </p>
              )}

              {deliveryStatus === "Available" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center max-w-xs mx-auto">
                  <p className="text-green-700 font-semibold text-sm">
                    🎉 Delivery Available!
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    We deliver to your location
                  </p>
                </div>
              )}

              {deliveryStatus === "Unavailable" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center max-w-xs mx-auto">
                  <p className="text-red-700 font-semibold text-sm">
                    ❌ Delivery Not Available
                  </p>
                  <p className="text-red-600 text-xs mt-1">
                    Please check another pincode
                  </p>
                </div>
              )}

              <div className="text-center">
                <p className="text-xs text-gray-500">
                  *Delivery available across India
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffersOrderPage;
