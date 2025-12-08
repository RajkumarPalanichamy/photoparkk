import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaPhoneAlt,
  FaTruck,
  FaLock,
  FaWhatsapp,
} from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";
import {
  Sparkles,
  Package,
  Ruler,
  Box,
  CheckCircle2,
  Loader2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { useCart } from "../../context/CartContext";
import {
  CONTACT_TEL_LINK,
  CONTACT_WHATSAPP_LINK,
} from "../../constants/contact";
import { toast } from "react-toastify";

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
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState(null);
  const { addToCart } = useCart();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setUploadedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const uploadImageAndGetUrl = async () => {
    if (!uploadedImage) return null;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", uploadedImage);
    try {
      const res = await axiosInstance.post("/cart/api/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploading(false);
      return res.data.imageUrl;
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed. Please try again.");
      setUploading(false);
      return null;
    }
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
    if (!uploadedImage) {
      toast.error("Please upload your image before adding to cart.");
      return;
    }
    if (!userId) {
      toast.error("You must be logged in to add to cart.");
      navigate("/login");
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
        toast.success("Item added to cart successfully!");
        navigate("/cart");
      } else {
        toast.error("Failed to add to cart.");
      }
    } catch (error) {
      console.error("Add to cart failed", error);
      toast.error("Failed to add to cart.");
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
        const res = await axiosInstance.get(`/newarrivals/${id}`);

        if (res.data) {
          setProduct(res.data);
          if (Array.isArray(res.data.sizes) && res.data.sizes.length > 0) {
            setSelectedSize(res.data.sizes[0]);
          }
          if (
            Array.isArray(res.data.thickness) &&
            res.data.thickness.length > 0
          ) {
            setSelectedThickness(res.data.thickness[0]);
          } else if (res.data.thickness) {
            setSelectedThickness(res.data.thickness);
          }
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchProduct();
  }, [id]);

  if (loading && !product) {
    return (
      <div className="bg-neutral-50 pt-[100px] pb-8 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-neutral-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-neutral-50 pt-[100px] pb-8 px-4 min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-secondary mb-2">
            Product not found
          </h3>
          <p className="text-neutral-600">
            The product you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 pt-[100px] pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Custom Product</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
            Complete Your Order
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Upload your photo and select your preferred size and thickness
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Upload Section - Left Side */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-neutral-200">
              <div className="bg-primary px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Upload className="w-6 h-6" />
                  Upload Your Photo
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {!previewUrl ? (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer bg-neutral-50 hover:bg-neutral-100 hover:border-primary transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-12 h-12 text-neutral-400 mb-3" />
                      <p className="mb-2 text-sm text-neutral-700">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-neutral-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <div className="space-y-4">
                    <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden border-2 border-neutral-200">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setPreviewUrl(null);
                      }}
                      className="w-full py-2 px-4 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
                    >
                      Remove Image
                    </button>
                  </div>
                )}

                {/* Live Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Live Preview
                  </h3>
                  <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden shadow-2xl border-8 border-neutral-200 flex items-center justify-center">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Frame Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-neutral-400">
                        <div className="p-4 bg-neutral-200 rounded-full mb-4">
                          <ImageIcon className="w-12 h-12" />
                        </div>
                        <p className="text-lg font-medium mb-2">
                          No image selected
                        </p>
                        <p className="text-sm text-center px-4">
                          Upload a photo to see your preview
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customization and Add to Cart */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
              <div className="bg-primary px-6 py-4">
                <h2 className="text-xl font-bold text-white">
                  {product.title}
                </h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Price */}
                <div>
                  <div className="text-4xl font-bold text-primary mb-2">
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
                  <div className="mt-2 text-sm text-error font-medium flex items-center gap-2">
                    <span>⏰</span>
                    <span>Limited stock available</span>
                  </div>
                </div>

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    <label className="block text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                      <Ruler className="w-5 h-5 text-primary" />
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
                          <div className="text-xs mt-1 opacity-80">
                            ₹{sizeObj.price}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thickness Selection */}
                {product.thickness && (
                  <div>
                    <label className="block text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                      <Box className="w-5 h-5 text-primary" />
                      Select Thickness
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(Array.isArray(product.thickness)
                        ? product.thickness
                        : [product.thickness]
                      ).map((thick, i) => (
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
                )}

                {/* Quantity and Add to Cart */}
                <div className="space-y-4 pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-4">
                    <label className="text-lg font-medium text-neutral-700">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Number(e.target.value)))
                      }
                      className="w-24 px-4 py-2 border-2 border-neutral-300 rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary-light font-semibold text-center"
                    />
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={
                      loading ||
                      uploading ||
                      !selectedSize ||
                      !selectedThickness ||
                      !uploadedImage
                    }
                    className="w-full sm:w-auto min-w-[200px] bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  >
                    {loading || uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>
                          {uploading ? "Uploading..." : "Adding to Cart..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <FaShoppingCart size={20} />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Shipping and Security Info */}
                <div className="space-y-3 pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-3 text-neutral-700">
                    <FaTruck className="text-primary" />
                    <span className="text-sm">
                      Estimated delivery in 4–7 working days
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-primary-hover font-semibold">
                    <FaLock className="text-primary" />
                    <span className="text-sm">
                      Secure Checkout | Satisfaction Guaranteed
                    </span>
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
                  <div
                    key={i}
                    className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl hover:bg-primary-light transition-all duration-300 hover:shadow-md border border-neutral-100"
                  >
                    <BsPatchCheckFill className="text-primary mt-0.5 flex-shrink-0 w-5 h-5" />
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

export default NewArrivalOrderPage;
