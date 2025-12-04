import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Loader2,
  Package,
  Ruler,
  Box,
  Image as ImageIcon,
  Edit,
  Plus,
} from "lucide-react";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
  MAX_UPLOAD_SIZE_FULL_TEXT,
} from "../../../../constants/upload";

const NewarrivalUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    thickness: "",
    stock: "In Stock",
    sizes: [{ label: "", price: "", original: "" }],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `https://api.photoparkk.com/api/newarrivals/${id}`
        );
        setFormData({
          ...res.data,
          sizes: res.data.sizes?.length
            ? res.data.sizes
            : [{ label: "", price: "", original: "" }],
        });
        setImagePreview(res.data.image);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("Failed to load product.");
        navigate("/admin/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      sizes: updatedSizes,
    }));
  };

  const addSizeField = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { label: "", price: "", original: "" }],
    }));
  };

  const removeSizeField = (indexToRemove) => {
    if (formData.sizes.length === 1) return;
    const updatedSizes = formData.sizes.filter((_, i) => i !== indexToRemove);
    setFormData((prev) => ({
      ...prev,
      sizes: updatedSizes,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      alert(
        `File size should be less than ${MAX_UPLOAD_SIZE_MB}MB. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB.`
      );
      e.target.value = ""; // Clear the file input
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(formData.image);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const cleanedSizes = formData.sizes.map((s) => ({
        label: s.label.trim(),
        price: Number(s.price) || 0,
        original: Number(s.original) || 0,
      }));

      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("content", formData.content.trim());
      data.append("thickness", formData.thickness.trim());
      data.append("stock", formData.stock.trim() || "In Stock");
      data.append("sizes", JSON.stringify(cleanedSizes));

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axios.put(
        `https://api.photoparkk.com/api/newarrivals/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      alert(
        error.response?.data?.message ||
          "Failed to update product. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-gray-600">Loading product...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-indigo-600 mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Edit className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Edit New Arrival Product
            </h1>
            <p className="text-gray-500 mt-1">
              Update product information and details
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
              className="w-full px-4 py-2.5 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              className="w-full px-4 py-2.5 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition resize-none"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-600" />
            Product Image
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Update Image (optional)
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <label className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {imageFile && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    {MAX_UPLOAD_SIZE_FULL_TEXT}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            Product Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Thickness
              </label>
              <input
                type="text"
                name="thickness"
                value={formData.thickness}
                onChange={handleChange}
                placeholder="e.g., 3mm, 5mm"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Stock Status
              </label>
              <select
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Low Stock">Low Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Ruler className="w-5 h-5 text-indigo-600" />
              Product Sizes
            </h2>
            <button
              type="button"
              onClick={addSizeField}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Size
            </button>
          </div>

          <div className="space-y-3">
            {formData.sizes.map((size, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Size Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 10x12"
                    value={size.label}
                    onChange={(e) =>
                      handleSizeChange(index, "label", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-slate-900 rounded-md focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-200 text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={size.price}
                    onChange={(e) =>
                      handleSizeChange(index, "price", e.target.value)
                    }
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-slate-900 rounded-md focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-200 text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Original (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={size.original}
                    onChange={(e) =>
                      handleSizeChange(index, "original", e.target.value)
                    }
                    min="0"
                    className="w-full px-3 py-2 bg-white border border-gray-300 text-slate-900 rounded-md focus:outline-indigo-600 focus:ring-1 focus:ring-indigo-200 text-sm"
                  />
                </div>
                <div className="col-span-12 sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSizeField(index)}
                    disabled={formData.sizes.length === 1}
                    className="w-full px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating Product...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Update Product</span>
              </>
            )}
          </button>
          <Link
            to="/admin/products"
            className="flex-1 sm:flex-initial px-6 py-3 text-center border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewarrivalUpdateForm;
