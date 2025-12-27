import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
} from "../../../../constants/upload";

const SpecialoffersUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 1,
    thickness: "",
    stock: "",
    image: "",
    sizes: [{ label: "", price: "", original: "" }],
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/specialoffers/${id}`);
        setFormData({
          ...res.data,
          sizes: res.data.sizes?.length
            ? res.data.sizes
            : [{ label: "", price: "", original: "" }],
        });
      } catch (error) {
        console.error("Failed to fetch product:", error);
        alert("Error loading product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
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
    setFormData((prev) => ({
      ...prev,
      image: URL.createObjectURL(file),
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const updated = [...formData.sizes];
    updated[index][field] = value;
    setFormData((prev) => ({
      ...prev,
      sizes: updated,
    }));
  };

  // Parse size label (e.g., "10x12") into width and height
  const parseSizeLabel = (label) => {
    if (!label) return { width: 0, height: 0 };
    const parts = label.split("x");
    return {
      width: parseInt(parts[0]) || 0,
      height: parseInt(parts[1]) || 0,
    };
  };

  // Handle direct input for dimensions
  const handleDimensionInput = (index, dimension, value) => {
    const currentLabel = formData.sizes[index].label || "0x0";
    const { width, height } = parseSizeLabel(currentLabel);
    const numValue = parseInt(value) || 0;
    const newWidth = dimension === "width" ? numValue : width;
    const newHeight = dimension === "height" ? numValue : height;
    const newLabel = `${newWidth}x${newHeight}`;
    handleSizeChange(index, "label", newLabel);
  };

  const addSizeField = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { label: "", price: "", original: "" }],
    }));
  };

  const removeSizeField = (indexToRemove) => {
    if (formData.sizes.length === 1) return; // Prevent removing the last one
    const updated = formData.sizes.filter(
      (_, index) => index !== indexToRemove
    );
    setFormData((prev) => ({
      ...prev,
      sizes: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const cleanedSizes = formData.sizes.map((size) => ({
        label: size.label.trim(),
        price: Number(size.price),
        original: Number(size.original),
      }));

      const data = new FormData();
      data.append("title", formData.title.trim());
      data.append("content", formData.content.trim());
      data.append("rating", Number(formData.rating));
      data.append("thickness", formData.thickness.trim());
      data.append("stock", formData.stock.trim());
      data.append("sizes", JSON.stringify(cleanedSizes));

      if (imageFile) {
        data.append("image", imageFile);
      }

      await axiosInstance.put(`/specialoffers/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated successfully!");
      navigate("/adminproducts");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update product.");
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-xl">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Update Special Offer
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Product Title"
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full border p-2 rounded"
          required
        />

        {/* Image Upload */}
        <div>
          <label className="block font-medium mb-1">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2 rounded"
          />
          {formData.image && (
            <img
              src={formData.image}
              alt="Uploaded Preview"
              className="w-32 h-32 object-cover mt-2 rounded border"
            />
          )}
        </div>

        <select
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {`${r} Star${r > 1 ? "s" : ""}`}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="thickness"
          value={formData.thickness}
          onChange={handleChange}
          placeholder="Thickness"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="Stock Info"
          className="w-full border p-2 rounded"
        />

        {/* Sizes Section */}
        <div>
          <label className="font-semibold block mb-2">Sizes</label>
          {formData.sizes.map((size, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-2 mb-2 items-center"
            >
              <div className="flex items-center gap-2">
                {/* Width Input */}
                <input
                  type="number"
                  min="0"
                  value={parseSizeLabel(size.label).width || ""}
                  onChange={(e) =>
                    handleDimensionInput(index, "width", e.target.value)
                  }
                  className="w-16 px-2 py-1.5 bg-white border border-neutral-300 rounded text-sm focus:outline-primary focus:ring-1 focus:ring-primary-light font-medium"
                  placeholder="W"
                />
                <span className="text-neutral-500 font-semibold text-sm">
                  ×
                </span>
                {/* Height Input */}
                <input
                  type="number"
                  min="0"
                  value={parseSizeLabel(size.label).height || ""}
                  onChange={(e) =>
                    handleDimensionInput(index, "height", e.target.value)
                  }
                  className="w-16 px-2 py-1.5 bg-white border border-neutral-300 rounded text-sm focus:outline-primary focus:ring-1 focus:ring-primary-light font-medium"
                  placeholder="H"
                />
              </div>
              <input
                type="number"
                placeholder="Price"
                value={size.price}
                onChange={(e) =>
                  handleSizeChange(index, "price", e.target.value)
                }
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Original"
                value={size.original}
                onChange={(e) =>
                  handleSizeChange(index, "original", e.target.value)
                }
                className="p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => removeSizeField(index)}
                className="text-red-500 hover:underline text-sm"
                disabled={formData.sizes.length === 1}
                title="Remove"
              >
                ❌
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addSizeField}
            className="text-sm text-primary mt-2 underline"
          >
            + Add Another Size
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-primary-hover transition"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default SpecialoffersUpdateForm;
