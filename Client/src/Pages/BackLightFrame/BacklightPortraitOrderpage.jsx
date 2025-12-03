import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaPhoneAlt, FaTruck, FaLock } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { Sparkles, Package, Ruler, Box, CheckCircle2, Loader2, Lightbulb } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import {
  CONTACT_TEL_LINK,
  CONTACT_WHATSAPP_LINK,
} from "../../constants/contact";
import { toast } from "react-toastify";

const BacklightPortraitOrderpage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photoData } = location.state || {};

  const [product, setProduct] = useState({
    title: "Portrait Backlight Customize",
    sizes: [
      { label: "8x10", price: 499, original: 699 },
      { label: "12x16", price: 699, original: 899 },
      { label: "16x20", price: 899, original: 1199 },
    ],
    thickness: ["3mm", "5mm", "8mm"],
    highlights: [
      "Premium quality Backlightframe",
      "Premium Backlighting effect",
      "Edge-to-edge printing",
      "Matte finish",
      "Perfect for gifts & decor",
      "High-Quality Finish & Durable Material",
      "Perfect for Home Decor & Gifting",
      "Customizable with Your Photo",
      "Secure Packaging for Safe Delivery",
      "Easy to Hang or Display",
      "Multiple Sizes & Thickness Options",
    ],
  });

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedThickness, setSelectedThickness] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser._id);
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }

    if (product.sizes?.length > 0) setSelectedSize(product.sizes[0]);
    if (product.thickness?.length > 0)
      setSelectedThickness(product.thickness[0]);
  }, [product]);

  const getFrameDimensions = (sizeLabel) => {
    const match = sizeLabel?.match(/(\d+)x(\d+)/);
    if (match) {
      return { width: parseInt(match[1]), height: parseInt(match[2]) };
    }
    return { width: 8, height: 10 };
  };

  const getBorderWidth = (thickness) => {
    const thicknessMap = {
      "3mm": "8px",
      "5mm": "12px",
      "8mm": "16px",
    };
    return thicknessMap[thickness] || "10px";
  };

  const getAspectRatio = (sizeLabel) => {
    const dims = getFrameDimensions(sizeLabel);
    return dims.width / dims.height;
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedThickness) {
      toast.error("Please select size and thickness.");
      return;
    }
    if (quantity < 1) {
      toast.error("Quantity must be at least 1.");
      return;
    }
    if (!userId) {
      toast.error("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const cartData = {
        userId,
        productType: "Backlightcustomizedata",
        title: product.title,
        image: photoData?.url,
        size: selectedSize.label,
        thickness: selectedThickness,
        price: selectedSize.price,
        quantity,
        totalAmount: selectedSize.price * quantity,
        uploadedImageUrl: photoData?.url,
      };

      if (photoData?.productId) {
        cartData.productId = photoData.productId;
      }

      await axiosInstance.post("/cart", cartData);
      toast.success("Item added to cart successfully!");
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed", error);
      toast.error("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  if (!photoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-lg text-red-600 font-semibold">
            No image found. Please upload again.
          </p>
        </div>
      </div>
    );
  }

  const frameDims = selectedSize ? getFrameDimensions(selectedSize.label) : { width: 8, height: 10 };
  const borderWidth = selectedThickness ? getBorderWidth(selectedThickness) : "10px";
  const aspectRatio = selectedSize ? getAspectRatio(selectedSize.label) : 0.8;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-yellow-50/30 to-amber-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white px-6 py-2 rounded-full mb-4">
            <Lightbulb className="w-5 h-5" />
            <span className="font-semibold">Portrait Backlight Frame</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Complete Your Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your preferred size and thickness to see your custom backlight frame preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Live Frame Preview
                </h2>
              </div>
              
              <div className="p-8">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="w-full max-w-md mx-auto text-center p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                    <p className="text-sm text-gray-600 mb-1">Selected Size</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {frameDims.width}" × {frameDims.height}"
                    </p>
                    {selectedThickness && (
                      <p className="text-sm text-gray-600 mt-1">
                        Thickness: {selectedThickness}
                      </p>
                    )}
                  </div>

                  <div className="relative w-full max-w-lg mx-auto">
                    <div
                      className={`relative mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 mask-portrait ${
                        lightOn ? "ring-4 ring-yellow-400 shadow-yellow-300" : ""
                      }`}
                      style={{
                        aspectRatio: aspectRatio,
                        borderWidth: borderWidth,
                        borderStyle: "solid",
                        borderColor: lightOn ? "#fbbf24" : "#1f2937",
                        padding: "4px",
                        boxShadow: lightOn
                          ? "0 0 30px rgba(251, 191, 36, 0.6), 0 0 60px rgba(251, 191, 36, 0.4)"
                          : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        <img
                          src={photoData?.url}
                          alt="Frame Preview"
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            lightOn ? "brightness-125 contrast-110" : ""
                          }`}
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setLightOn(!lightOn)}
                      className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <Lightbulb className={`w-4 h-4 ${lightOn ? "animate-pulse" : ""}`} />
                      {lightOn ? "Light On" : "Light Off"}
                    </button>
                    
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded shadow-md">
                      {frameDims.height}"
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700 bg-white px-2 py-1 rounded shadow-md">
                      {frameDims.width}"
                    </div>
                  </div>

                  <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Preview:</span> Your photo will be printed in a{" "}
                      <span className="font-bold text-indigo-700">{selectedSize?.label}</span> portrait backlight frame
                      {selectedThickness && (
                        <> with <span className="font-bold text-indigo-700">{selectedThickness}</span> thickness</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white">{product.title}</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-yellow-600 mb-2">
                    ₹{selectedSize?.price || 0}
                  </div>
                  {selectedSize?.original && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-gray-400 line-through">
                        ₹{selectedSize.original}
                      </span>
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                        Free Shipping
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-red-600 font-medium flex items-center gap-2">
                    <span>⏰</span>
                    <span>Limited stock available</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-yellow-600" />
                    Select Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.sizes.map((sizeObj, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(sizeObj)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          selectedSize?.label === sizeObj.label
                            ? "bg-yellow-600 text-white border-yellow-600 shadow-lg scale-105"
                            : "bg-white text-gray-800 border-gray-300 hover:border-yellow-400 hover:shadow-md"
                        }`}
                      >
                        <div className="font-bold">{sizeObj.label}</div>
                        <div className="text-xs mt-1 opacity-80">₹{sizeObj.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Box className="w-5 h-5 text-yellow-600" />
                    Select Thickness
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.thickness.map((thick, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedThickness(thick)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          selectedThickness === thick
                            ? "bg-yellow-600 text-white border-yellow-600 shadow-lg scale-105"
                            : "bg-white text-gray-800 border-gray-300 hover:border-yellow-400 hover:shadow-md"
                        }`}
                      >
                        {thick}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <label className="text-lg font-medium text-gray-700">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-24 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-yellow-600 focus:ring-2 focus:ring-yellow-200 font-semibold text-center"
                    />
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={loading || !selectedSize || !selectedThickness}
                    className="w-full bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Adding to Cart...</span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-3 text-gray-700">
                    <FaTruck className="text-yellow-600" />
                    <span className="text-sm">Estimated delivery in 4–7 working days</span>
                  </div>
                  <div className="flex items-center gap-3 text-indigo-700 font-semibold">
                    <FaLock className="text-indigo-600" />
                    <span className="text-sm">Secure Checkout | Satisfaction Guaranteed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Product Highlights
                </h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2.5">
                  {product.highlights.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 py-1.5 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                    >
                      <BsPatchCheckFill className="text-indigo-600 mt-0.5 flex-shrink-0 w-4 h-4" />
                      <span className="text-sm text-gray-700 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-6 h-6" />
                  Bulk Orders
                </h3>
              </div>
              <div className="p-6 space-y-5">
                <div className="text-center space-y-2">
                  <p className="text-lg font-bold text-gray-900">
                    Need Bulk Quantities?
                  </p>
                  <p className="text-base text-purple-600 font-semibold">
                    Special Deals on Bulk Orders!
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Ideal for Corporate Gifting and Celebrations.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => (window.location.href = CONTACT_TEL_LINK)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-5 py-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaPhoneAlt size={18} />
                    <span>Call for Bulk Orders</span>
                  </button>

                  <button
                    onClick={() => window.open(CONTACT_WHATSAPP_LINK, "_blank")}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-5 py-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaPhoneAlt size={18} />
                    <span>WhatsApp Us</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklightPortraitOrderpage;
