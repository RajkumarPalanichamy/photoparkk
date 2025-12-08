import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaPhoneAlt, FaTruck, FaLock, FaWhatsapp } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import { Sparkles, Package, Ruler, Box, CheckCircle2, Loader2 } from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import {
  CONTACT_TEL_LINK,
  CONTACT_WHATSAPP_LINK,
} from "../../constants/contact";
import { toast } from "react-toastify";

const CanvasPortraitOrderpage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photoData } = location.state || {};

  const [product, setProduct] = useState({
    title: "Portrait Canvas Customize",
    sizes: [
      { label: "8x10", price: 499, original: 699 },
      { label: "12x16", price: 699, original: 899 },
      { label: "16x20", price: 899, original: 1199 },
    ],
    thickness: ["3mm", "5mm", "8mm"],
    highlights: [
      "Premium quality canvas",
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
        productType: "Canvascustomizedata",
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
      <div className="flex items-center justify-center bg-primary">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <p className="text-lg text-error font-semibold">
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
    <div className="bg-neutral-50 pt-[80px] pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Portrait Canvas Frame</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
            Complete Your Order
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Select your preferred size and thickness to see your custom canvas frame preview
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live Frame Preview */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
              <div className="bg-primary px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <Package className="w-6 h-6" />
                  Live Frame Preview
                </h2>
              </div>
              
              <div className="p-8 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative w-full max-w-lg mx-auto">
                    <div
                      className="relative mx-auto bg-primary rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 mask-portrait"
                      style={{
                        aspectRatio: aspectRatio,
                        borderWidth: borderWidth,
                        borderStyle: "solid",
                        borderColor: "#92400e",
                        padding: "4px",
                      }}
                    >
                      <div className="w-full h-full rounded-lg overflow-hidden">
                        <img
                          src={photoData?.url}
                          alt="Frame Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-neutral-700 bg-white px-2 py-1 rounded shadow-md">
                      {frameDims.height}"
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-neutral-700 bg-white px-2 py-1 rounded shadow-md">
                      {frameDims.width}"
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Customization and Add to Cart */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h2 className="text-xl font-bold text-white">{product.title}</h2>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <div className="text-4xl font-bold text-warning mb-2">
                    ₹{selectedSize?.price || 0}
                  </div>
                  {selectedSize?.original && (
                    <div className="flex items-center gap-3">
                      <span className="text-xl text-neutral-400 line-through">
                        ₹{selectedSize.original}
                      </span>
                      <span className="px-3 py-1 bg-primary-light text-primary-hover rounded-full text-sm font-semibold">
                        Free Shipping
                      </span>
                    </div>
                  )}
                  <div className="mt-2 text-sm text-error font-medium flex items-center justify-center gap-2">
                    <span>⏰</span>
                    <span>Limited stock available</span>
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-secondary mb-3 flex items-center justify-center gap-2">
                    <Ruler className="w-5 h-5 text-warning" />
                    Select Size
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.sizes.map((sizeObj, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedSize(sizeObj)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          selectedSize?.label === sizeObj.label
                            ? "bg-primary text-white border-primary shadow-lg scale-105"
                            : "bg-white text-secondary border-neutral-300 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        <div className="font-bold">{sizeObj.label}</div>
                        <div className="text-xs mt-1 opacity-80">₹{sizeObj.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-lg font-semibold text-secondary mb-3 flex items-center justify-center gap-2">
                    <Box className="w-5 h-5 text-warning" />
                    Select Thickness
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {product.thickness.map((thick, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedThickness(thick)}
                        className={`px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                          selectedThickness === thick
                            ? "bg-primary text-white border-primary shadow-lg scale-105"
                            : "bg-white text-secondary border-neutral-300 hover:border-primary hover:shadow-md"
                        }`}
                      >
                        {thick}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-4">
                    <label className="text-lg font-medium text-neutral-700">Quantity:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-24 px-4 py-2 border-2 border-neutral-300 rounded-lg focus:outline-amber-600 focus:ring-2 focus:ring-amber-200 font-semibold text-center"
                    />
                  </div>
                  
                  <button
                    onClick={handleAddToCart}
                    disabled={loading || !selectedSize || !selectedThickness}
                    className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
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

                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-3 text-neutral-700">
                    <FaTruck className="text-warning" />
                    <span className="text-sm">Estimated delivery in 4–7 working days</span>
                  </div>
                  <div className="flex items-center gap-3 text-primary-hover font-semibold">
                    <FaLock className="text-primary" />
                    <span className="text-sm">Secure Checkout | Satisfaction Guaranteed</span>
                  </div>
                </div>
                  </div>
                </div>
              </div>
            </div>

        {/* Product Highlights and Bulk Orders - Below main content */}
        <div className="grid grid-cols-1 gap-8 mt-8">
          {/* Product Highlights Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  Product Highlights
                </h3>
              </div>
              <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
                  {product.highlights.map((item, i) => (
                    <div
                      key={i}
                    className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl hover:bg-primary-light transition-all duration-300 hover:shadow-md border border-neutral-100"
                    >
                    <div className="flex-shrink-0 mt-0.5">
                      <BsPatchCheckFill className="text-primary w-5 h-5" />
                    </div>
                      <span className="text-sm font-medium text-neutral-700 leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          {/* Bulk Orders Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <Package className="w-6 h-6" />
                  Bulk Orders
                </h3>
              </div>
              <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <div className="text-center space-y-3 mb-6">
                  <p className="text-2xl font-bold text-secondary">
                    Need Bulk Quantities?
                  </p>
                  <p className="text-lg text-primary font-semibold">
                    Special Deals on Bulk Orders!
                  </p>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    Ideal for Corporate Gifting and Celebrations.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => (window.location.href = CONTACT_TEL_LINK)}
                    className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary-hover text-white px-6 py-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaPhoneAlt size={18} />
                    <span>Call for Bulk Orders</span>
                  </button>

                  <button
                    onClick={() => window.open(CONTACT_WHATSAPP_LINK, "_blank")}
                    className="w-full sm:w-auto min-w-[200px] bg-success hover:bg-success/90 text-white px-6 py-3.5 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <FaWhatsapp size={18} />
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

export default CanvasPortraitOrderpage;
