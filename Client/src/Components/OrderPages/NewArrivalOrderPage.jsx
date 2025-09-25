// NewArrivalOrderPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaGift,
  FaShoppingCart,
  FaPhoneAlt,
  FaEnvelope,
  FaStar,
} from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import { useCart } from "../../context/CartContext";

const NewArrivalOrderPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedThickness, setSelectedThickness] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [userId, setUserId] = useState(null);
  const { addToCart } = useCart();

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
      const res = await axiosInstance.post(
        "/cart/api/upload-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return res.data.imageUrl;
    } catch (error) {
      console.error("Image upload failed", error);
      alert("Image upload failed. Please try again.");
      return null;
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedThickness) {
      alert("Please select size and thickness.");
      return;
    }
    if (quantity < 1) {
      alert("Quantity must be at least 1.");
      return;
    }
    if (!uploadedImage) {
      alert("Please upload your image before adding to cart.");
      return;
    }
    if (!userId) {
      alert("You must be logged in to add to cart.");
      return;
    }

    setLoading(true);
    try {
      const uploadedImageUrl = await uploadImageAndGetUrl();
      if (!uploadedImageUrl) {
        setLoading(false);
        return;
      }

      const cartData = {
        userId,
        productId: product._id,
        productType: "Newarrivaldata",
        title: product.title,
        quantity,
        size: selectedSize.label,
        thickness: selectedThickness,
        price: selectedSize.price,
        totalAmount: selectedSize.price * quantity,
        image: uploadedImageUrl,
      };

      const result = await addToCart(cartData);
      if (result.success) {
        alert("✅ Item added to cart successfully!");
        navigate("/cart");
      } else {
        alert("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Add to cart failed", error);
      alert("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUser = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUserId(parsedUser._id);
        } catch (err) {
          console.error("Failed to parse user from localStorage:", err);
        }
      }
    };

    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(
          `/newarrivals/${id}`
        );
        setProduct(res.data);
        if (res.data.sizes?.length > 0) setSelectedSize(res.data.sizes[0]);
        if (res.data.thickness) setSelectedThickness(res.data.thickness);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchProduct();
  }, [id]);

  if (loading) return <div className="p-8 text-center text-lg">Loading...</div>;
  if (!product)
    return <div className="p-8 text-center text-lg">Product not found</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
        {/* Upload + Preview */}
        <div className="space-y-6">
          <label className="block text-2xl font-semibold text-center mb-3">
            <p>Upload Your Photo</p>
            <p>Ordered as Same material</p>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:rounded file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border"
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-4 w-full max-h-120 border rounded-lg p-4 object-contain"
            />
          ) : (
            <div className="rounded-lg border border-gray-200">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 border p-6 rounded-2xl shadow-md bg-white max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">{product.title}</h2>

          {/* Ratings */}
          {product.rating && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span>({product.rating} / 5)</span>
              </div>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-md text-xs font-semibold">
                Quality Checked
              </span>
            </div>
          )}

          {/* Price */}
          <div className="text-3xl font-bold text-yellow-500">
            ₹{selectedSize?.price || "0"}
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
            ⏰ Hurry! Only a few pieces left at this price.
          </div>

          {/* Size Selection */}
          <div>
            <label className="block text-xl font-semibold mb-3">
              Select Size
            </label>
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((sizeObj, i) => (
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

          {/* Thickness Selection */}
          <div>
            <label className="block text-xl font-semibold mb-3">
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

          {/* Quantity + CTA */}
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
              <FaShoppingCart size={20} />
              {loading ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          <div className="text-lg text-gray-500 mt-4">
            🚚 Estimated delivery in{" "}
            <span className="text-black font-medium">4–7 working days</span>
          </div>
          <div className="text-center text-green-700 font-semibold text-lg mt-4">
            🔒 Secure Checkout | 100% Satisfaction Guarantee
          </div>
        </div>

        {/* Highlights & Enquiry */}
        <div className="bg-white p-6 rounded-2xl shadow-lg space-y-8 border border-gray-200">
          <div>
            <h4 className="text-xl font-bold  text-center mb-4 tracking-wide">
              HIGHLIGHTS
            </h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-base">
              {(product.highlights?.length
                ? product.highlights
                : [
                    "High-Quality Finish & Durable Material",
                    "Perfect for Home Decor & Gifting",
                    "Customizable with Your Photo",
                    "Secure Packaging for Safe Delivery",
                    "Eco-Friendly Printing Process",
                    "Crafted with Precision & Love",
                    "Easy to Hang or Display",
                    "Multiple Sizes & Thickness Options",
                  ]
              ).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="text-center text-sm text-gray-800 space-y-4">
            <p className="text-lg font-semibold text-black">
              NEED BULK QUANTITIES?
            </p>
            <p className="text-base text-orange-600 font-medium">
              Amazing Deals on Bulk Orders Available Now!
            </p>
            <p className="text-gray-600">
              Perfect for Gifts and Return Gifts for any occasion.
            </p>
            <button
              onClick={() => (window.location.href = "tel:9940770011")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg w-full flex items-center justify-center gap-3 font-semibold transition duration-200 shadow"
            >
              <FaPhoneAlt size={18} />
              Call & Book Bulk Orders
            </button>
            <button
              onClick={() =>
                window.open("https://wa.me/919940770011", "_blank")
              }
              className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-lg w-full flex items-center justify-center gap-3 font-semibold transition duration-200 shadow"
            >
              <FaPhoneAlt size={18} />
              Chat on WhatsApp for Bulk Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivalOrderPage;
