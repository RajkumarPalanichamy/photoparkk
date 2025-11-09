import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaPhoneAlt, FaTruck, FaLock } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import axiosInstance from "../../utils/axiosInstance";
import {
  CONTACT_TEL_LINK,
  CONTACT_WHATSAPP_LINK,
} from "../../constants/contact";

const AcrylicSquareOrderpage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { photoData } = location.state || {};

  const [product, setProduct] = useState({
    title: "Square Acrylic Customize",
    sizes: [
      { label: "8x8", price: 499, original: 699 },
      { label: "12x12", price: 699, original: 899 },
      { label: "16x16", price: 899, original: 1199 },
    ],
    thickness: ["3mm", "5mm", "8mm"],
    highlights: [
      "High-Quality Finish & Durable Material",
      "Perfect for Home Decor & Gifting",
      "Customizable with Your Photo",
      "Secure Packaging for Safe Delivery",
      "Eco-Friendly Printing Process",
      "Crafted with Precision & Love",
      "Easy to Hang or Display",
      "Multiple Sizes & Thickness Options",
      "Premium quality acrylic",
      "Edge-to-edge printing",
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

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedThickness) {
      alert("Please select size and thickness.");
      return;
    }
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }
    if (!userId) {
      alert("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const cartData = {
        userId,
        productType: "AcrylicCustomizedata",
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
      alert("Item added to cart successfully!");
      navigate("/cart");
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  if (!photoData) {
    return (
      <div className="p-8 text-center text-lg text-red-600">
        No image found. Please upload again.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Uploaded Image */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">
            Your Custom Photo
          </h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <img
              src={photoData?.url}
              alt={photoData?.name || "Uploaded"}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-gray-800 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">{product.title}</h2>

          <div className="text-3xl font-bold text-yellow-500">
            ₹{selectedSize?.price || 0}
            {selectedSize?.original && (
              <>
                <span className="ml-3 text-xl text-gray-400 line-through">
                  ₹{selectedSize.original}
                </span>
                <span className="ml-3 text-orange-500 text-lg font-medium">
                  Free Shipping
                </span>
              </>
            )}
          </div>

          <div className="text-sm text-red-600 font-medium">
            Limited stock available at this price.
          </div>

          {/* Size */}
          <div>
            <label className="block text-xl font-semibold mb-3">Size</label>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((sizeObj, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSize(sizeObj)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition duration-200 shadow-sm ${
                    selectedSize?.label === sizeObj.label
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-800 border-gray-300 hover:border-black"
                  }`}
                >
                  <div>{sizeObj.label}</div>
                  <div className="text-xs text-gray-500">₹{sizeObj.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-xl font-semibold mb-3">
              Thickness
            </label>
            <div className="flex flex-wrap gap-3">
              {product.thickness.map((thick, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedThickness(thick)}
                  className={`px-5 py-2 rounded-lg border text-sm font-medium transition duration-200 shadow-sm ${
                    selectedThickness === thick
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-800 border-gray-300 hover:border-black"
                  }`}
                >
                  {thick}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity & Cart */}
          <div className="flex items-center gap-5 mt-6">
            <label className="text-lg font-medium text-gray-700">Qty:</label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 border border-gray-300 px-3 py-2 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <button
              onClick={handleAddToCart}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              <FaShoppingCart size={18} />
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-2 text-gray-700 mt-4">
            <FaTruck />
            <span>Estimated delivery in 4–7 working days</span>
          </div>
          <div className="flex items-center gap-2 text-green-700 font-semibold">
            <FaLock />
            <span>Secure Checkout | Satisfaction Guaranteed</span>
          </div>
        </div>

        {/* Highlights + Bulk Order */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-gray-300 space-y-8">
          <div>
            <h4 className="text-xl font-bold text-center mb-4">Highlights</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-base">
              {product.highlights.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <BsPatchCheckFill className="text-green-600 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center text-sm text-gray-800 space-y-4">
            <p className="text-lg font-semibold text-black">
              Need Bulk Quantities?
            </p>
            <p className="text-base text-orange-600 font-medium">
              Special Deals on Bulk Orders!
            </p>
            <p className="text-gray-600">
              Ideal for Corporate Gifting and Celebrations.
            </p>

            <button
              onClick={() => (window.location.href = CONTACT_TEL_LINK)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg w-full flex items-center justify-center gap-3 font-semibold transition duration-200 shadow"
            >
              <FaPhoneAlt size={18} />
              Call for Bulk Orders
            </button>

            <button
              onClick={() =>
                window.open(CONTACT_WHATSAPP_LINK, "_blank")
              }
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg w-full flex items-center justify-center gap-3 font-semibold transition duration-200 shadow"
            >
              <FaPhoneAlt size={18} />
              WhatsApp Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcrylicSquareOrderpage;
