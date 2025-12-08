import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useCart } from "../context/CartContext";
import {
  Package,
  Ruler,
  Box,
  ShoppingCart,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Truck,
  Shield,
  Star,
  Upload,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  CONTACT_TEL_LINK,
  CONTACT_WHATSAPP_LINK,
} from "../constants/contact";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { BsPatchCheckFill } from "react-icons/bs";

const ProductDetails = () => {
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
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axiosInstance.get(`/newarrivals/${id}`);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.thickness && data.thickness.length > 0) {
          setSelectedThickness(data.thickness[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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
      const res = await axiosInstance.post(
        "/cart/api/upload-image",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
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

    const user = localStorage.getItem("user");
    if (!user) {
      toast.error("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    let userId;
    try {
      const parsedUser = JSON.parse(user);
      userId = parsedUser._id;
    } catch {
      toast.error("Please log in to add items to cart");
      navigate("/login");
      return;
    }

    setAddingToCart(true);
    try {
      const uploadedImageUrl = await uploadImageAndGetUrl();
      if (!uploadedImageUrl) {
        setAddingToCart(false);
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
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
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
        <div className="text-center">
          <Package className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-secondary mb-2">
            Product not found
          </h3>
          <Link
            to="/products"
            className="text-primary hover:text-primary-hover font-medium"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 pt-[100px] pb-8 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
            <div className="aspect-square bg-neutral-100">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/600?text=No+Image";
                }}
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Title and Rating */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-warning">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating || 4)
                          ? "fill-warning text-warning"
                          : "text-neutral-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-neutral-600">
                  ({product.rating || 4} rating)
                </span>
              </div>
            </div>

            {/* Price */}
            <div>
              {selectedSize ? (
                <>
                  <div className="text-4xl font-bold text-primary mb-2">
                    ₹{selectedSize.price}
                  </div>
                  {selectedSize.original &&
                    selectedSize.original > selectedSize.price && (
                      <div className="flex items-center gap-3">
                        <span className="text-xl text-neutral-400 line-through">
                          ₹{selectedSize.original}
                        </span>
                        <span className="px-3 py-1 bg-primary-light text-primary-hover rounded-full text-sm font-semibold">
                          Free Shipping
                        </span>
                      </div>
                    )}
                </>
              ) : (
                <div className="text-error font-medium">
                  Price not available
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <label className="block text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Upload Your Photo
              </label>
              {!previewUrl ? (
                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Upload className="w-12 h-12 text-neutral-400" />
                    <div>
                      <p className="text-neutral-700 font-medium mb-1">
                        Click to upload your photo
                      </p>
                      <p className="text-sm text-neutral-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-square bg-neutral-100 rounded-xl overflow-hidden">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setPreviewUrl(null);
                    }}
                    className="w-full py-2 px-4 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
                  >
                    Remove Image
                  </button>
                </div>
              )}
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
            {product.thickness && product.thickness.length > 0 && (
              <div>
                <label className="block text-lg font-semibold text-secondary mb-3 flex items-center gap-2">
                  <Box className="w-5 h-5 text-primary" />
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
            )}

            {/* Quantity */}
            <div>
              <label className="block text-lg font-medium text-neutral-700 mb-2">
                Quantity
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

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={
                addingToCart ||
                uploading ||
                !selectedSize ||
                !selectedThickness ||
                !uploadedImage
              }
              className="w-full bg-primary hover:bg-primary-hover text-white px-6 py-4 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {addingToCart || uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{uploading ? "Uploading..." : "Adding to Cart..."}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Product Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  Product Highlights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {product.highlights.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl"
                    >
                      <BsPatchCheckFill className="text-primary mt-0.5 flex-shrink-0 w-5 h-5" />
                      <span className="text-sm font-medium text-neutral-700">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

