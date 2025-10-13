import React, { useState } from "react";
import axiosInstance from "../../../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const NewArrivalAddForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: "",
    thickness: "",
    stock: "",
    sizes: [{ label: "", price: "0", original: "0" }],
  });

  const [imageFile, setImageFile] = useState(null);
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
    if (file) {
      setImageFile(file);
    }
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
      alert("Please fill in all required fields.");
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
        rating: Number(formData.rating) || 0,
        thickness: formData.thickness.trim(),
        stock: formData.stock.trim(),
        sizes: sanitizedSizes,
      };

      console.log("Submitting data:", dataToSend);

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
      navigate("/adminproducts");
    } catch (error) {
      console.error("Failed to add product:", error.response?.data || error);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Add New Arrival Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <textarea
          name="content"
          placeholder="Product Description"
          value={formData.content}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="number"
            name="rating"
            placeholder="Star Rating (1–5)"
            value={formData.rating}
            onChange={handleChange}
            className="p-2 border rounded"
            min={1}
            max={5}
          />
          <input
            type="text"
            name="thickness"
            placeholder="Thickness"
            value={formData.thickness}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="stock"
            placeholder="Stock Status (e.g. 'In Stock')"
            value={formData.stock}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        {/* Sizes */}
        <div>
          <label className="font-semibold block mb-2">Sizes</label>
          {formData.sizes.map((size, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <input
                type="text"
                placeholder="Label (e.g. 10x12)"
                value={size.label}
                onChange={(e) =>
                  handleSizeChange(index, "label", e.target.value)
                }
                className="p-2 border rounded"
              />
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
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeSizeField(index)}
                  className="col-span-3 text-sm text-red-600 mt-1"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSizeField}
            className="text-sm text-blue-600 underline"
          >
            + Add Another Size
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default NewArrivalAddForm;
