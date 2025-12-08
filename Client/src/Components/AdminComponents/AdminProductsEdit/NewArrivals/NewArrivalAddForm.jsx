import React, { useState } from "react";
import axiosInstance from "../../../../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Upload,
  X,
  Loader2,
  Package,
  Ruler,
  Box,
  Image as ImageIcon,
} from "lucide-react";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
  MAX_UPLOAD_SIZE_FULL_TEXT,
} from "../../../../constants/upload";

const NewArrivalAddForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thickness: "",
    stock: "In Stock",
    sizes: [{ label: "", price: "0", original: "0" }],
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    setImagePreview(null);
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
      sizes: [...prev.sizes, { label: "", price: "0", original: "0" }],
    }));
  };

  const removeSizeField = (index) => {
    if (formData.sizes.length === 1) return;
    const updated = [...formData.sizes];
    updated.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      sizes: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !imageFile) {
      alert(
        "Please fill in all required fields (Title, Description, and Image)."
      );
      return;
    }

    setLoading(true);

    try {
      const sanitizedSizes = formData.sizes.map((size) => ({
        label: size.label.trim(),
        price: Number(size.price) || 0,
        original: Number(size.original) || 0,
      }));

      const dataToSend = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        thickness: formData.thickness.trim(),
        stock: formData.stock.trim() || "In Stock",
        sizes: sanitizedSizes,
      };

      const data = new FormData();
      for (const [key, value] of Object.entries(dataToSend)) {
        if (key === "sizes") {
          data.append("sizes", JSON.stringify(value));
        } else {
          data.append(key, value);
        }
      }
      data.append("image", imageFile);

      await axiosInstance.post("/newarrivals", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product added successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to add product:", error.response?.data || error);
      alert(
        error.response?.data?.message ||
          "Failed to add product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/admin/products"
          className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-light rounded-lg">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Add New Arrival Product
            </h1>
            <p className="text-neutral-500 mt-1">
              Create a new product for the New Arrivals section
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 space-y-6"
      >
        {/* Basic Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Basic Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter product title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-slate-900 rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Product Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              placeholder="Enter product description"
              value={formData.content}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-slate-900 rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary-light transition resize-none"
              required
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Product Image
          </h2>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Upload Image <span className="text-red-500">*</span>
            </label>
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg border border-neutral-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-error-light0 text-white rounded-full hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-neutral-300 border-dashed rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-neutral-400" />
                  <p className="mb-2 text-sm text-neutral-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-neutral-500">
                    {MAX_UPLOAD_SIZE_FULL_TEXT}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-secondary flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Product Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                Thickness
              </label>
              <input
                type="text"
                name="thickness"
                placeholder="e.g., 3mm, 5mm"
                value={formData.thickness}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-slate-900 rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2 flex items-center gap-2">
                <Box className="w-4 h-4" />
                Stock Status
              </label>
              <select
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-white border border-neutral-300 text-slate-900 rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary-light transition"
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
            <h2 className="text-xl font-semibold text-secondary flex items-center gap-2">
              <Ruler className="w-5 h-5 text-primary" />
              Product Sizes
            </h2>
            <button
              type="button"
              onClick={addSizeField}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-primary-hover hover:bg-primary-light rounded-lg transition"
            >
              <Plus className="w-4 h-4" />
              Add Size
            </button>
          </div>

          <div className="space-y-3">
            {formData.sizes.map((size, index) => (
              <div
                key={index}
                className="grid grid-cols-12 gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="col-span-12 sm:col-span-4">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Size Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 10x12"
                    value={size.label}
                    onChange={(e) =>
                      handleSizeChange(index, "label", e.target.value)
                    }
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-slate-900 rounded-md focus:outline-primary focus:ring-1 focus:ring-primary-light text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-slate-900 rounded-md focus:outline-primary focus:ring-1 focus:ring-primary-light text-sm"
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
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
                    className="w-full px-3 py-2 bg-white border border-neutral-300 text-slate-900 rounded-md focus:outline-primary focus:ring-1 focus:ring-primary-light text-sm"
                  />
                </div>
                <div className="col-span-12 sm:col-span-2 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSizeField(index)}
                    disabled={formData.sizes.length === 1}
                    className="w-full px-3 py-2 text-sm font-medium text-error bg-error-light hover:bg-red-100 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Adding Product...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </>
            )}
          </button>
          <Link
            to="/admin/products"
            className="flex-1 sm:flex-initial px-6 py-3 text-center border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition font-medium"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default NewArrivalAddForm;
