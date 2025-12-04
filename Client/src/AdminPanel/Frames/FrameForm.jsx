// 📁 src/components/admin/FrameForm.jsx
import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import {
  Plus,
  Trash2,
  Upload,
  Palette,
  Image as ImageIcon,
  Ruler,
  Loader,
  X,
  Save,
  Sparkles,
} from "lucide-react";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_MB,
} from "../../constants/upload";

const FrameForm = ({ initialData, onSuccess, onClose }) => {
  const [shape, setShape] = useState(initialData?.shape || "");
  const [colorOptions, setColorOptions] = useState(
    initialData?.colorOptions || [
      {
        color: "",
        styles: [
          {
            styleName: "",
            frameImages: [
              {
                title: "",
                file: null,
                imageUrl: "",
                sizes: [{ label: "", amount: "" }],
              },
            ],
          },
        ],
      },
    ]
  );
  const [userUploadedImage, setUserUploadedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  // Color handlers
  const handleColorChange = (idx, field, value) => {
    const updated = [...colorOptions];
    updated[idx][field] = value;
    setColorOptions(updated);
  };

  const removeColor = (colorIdx) => {
    const updated = [...colorOptions];
    updated.splice(colorIdx, 1);
    setColorOptions(updated);
  };

  const addColor = () => {
    setColorOptions([
      ...colorOptions,
      {
        color: "",
        styles: [
          {
            styleName: "",
            frameImages: [
              {
                title: "",
                file: null,
                imageUrl: "",
                sizes: [{ label: "", amount: "" }],
              },
            ],
          },
        ],
      },
    ]);
  };

  // Style handlers
  const handleStyleChange = (colorIdx, styleIdx, field, value) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles[styleIdx][field] = value;
    setColorOptions(updated);
  };

  const addStyle = (colorIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles.push({
      styleName: "",
      frameImages: [
        {
          title: "",
          file: null,
          imageUrl: "",
          sizes: [{ label: "", amount: "" }],
        },
      ],
    });
    setColorOptions(updated);
  };

  const removeStyle = (colorIdx, styleIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles.splice(styleIdx, 1);
    setColorOptions(updated);
  };

  // Frame image handlers (same as before but with style level)
  const handleFrameImageChange = (colorIdx, styleIdx, imgIdx, field, value) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles[styleIdx].frameImages[imgIdx][field] = value;
    setColorOptions(updated);
  };

  const compressImage = (file, maxSizeKB = 5000) => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxDimension = 1200; // Max width or height

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob.size <= maxSizeKB * 1024) {
              resolve(blob);
            } else {
              // If still too large, compress more
              canvas.toBlob(
                (compressedBlob) => {
                  resolve(compressedBlob);
                },
                "image/jpeg",
                0.7
              );
            }
          },
          "image/jpeg",
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (colorIdx, styleIdx, imgIdx, file) => {
    if (!file) return;

    // Check file size (10MB limit)
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      alert(
        `File size too large. Maximum allowed size is ${MAX_UPLOAD_SIZE_MB}MB. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB. The image will be compressed.`
      );
    }

    try {
      setCompressing(true);
      // Compress the image
      const compressedFile = await compressImage(file);

      const updated = [...colorOptions];
      updated[colorIdx].styles[styleIdx].frameImages[imgIdx].file =
        compressedFile;
      setColorOptions(updated);
    } catch (error) {
      console.error("Error compressing image:", error);
      alert("Error processing image. Please try a different file.");
    } finally {
      setCompressing(false);
    }
  };

  const addFrameImage = (colorIdx, styleIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles[styleIdx].frameImages.push({
      title: "",
      file: null,
      imageUrl: "",
      sizes: [{ label: "", amount: "" }],
    });
    setColorOptions(updated);
  };

  const removeFrameImage = (colorIdx, styleIdx, imgIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles[styleIdx].frameImages.splice(imgIdx, 1);
    setColorOptions(updated);
  };

  // Size handlers (same as before but with style level)
  const handleSizeChange = (
    colorIdx,
    styleIdx,
    imgIdx,
    sizeIdx,
    field,
    value
  ) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles[styleIdx].frameImages[imgIdx].sizes[sizeIdx][
      field
    ] = value;
    setColorOptions(updated);
  };

  const addSize = (colorIdx, styleIdx, imgIdx) => {
    const updated = [...colorOptions];
    updated[colorIdx].styles[styleIdx].frameImages[imgIdx].sizes.push({
      label: "",
      amount: "",
    });
    setColorOptions(updated);
  };

  const removeSize = (colorIdx, styleIdx, imgIdx, sizeIdx) => {
    const updated = [...colorOptions];
    if (
      updated[colorIdx].styles[styleIdx].frameImages[imgIdx].sizes.length === 1
    )
      return;
    updated[colorIdx].styles[styleIdx].frameImages[imgIdx].sizes.splice(
      sizeIdx,
      1
    );
    setColorOptions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation (enhanced for new structure)
    if (!shape.trim()) {
      alert("Please enter a shape name");
      setLoading(false);
      return;
    }

    for (let colorIdx = 0; colorIdx < colorOptions.length; colorIdx++) {
      const color = colorOptions[colorIdx];
      if (!color.color.trim()) {
        alert(`Please enter a color name for color option ${colorIdx + 1}`);
        setLoading(false);
        return;
      }

      for (let styleIdx = 0; styleIdx < color.styles.length; styleIdx++) {
        const style = color.styles[styleIdx];
        if (!style.styleName.trim()) {
          alert(
            `Please enter a style name for style ${styleIdx + 1} in color ${
              color.color
            }`
          );
          setLoading(false);
          return;
        }

        for (let imgIdx = 0; imgIdx < style.frameImages.length; imgIdx++) {
          const img = style.frameImages[imgIdx];
          if (!img.title.trim()) {
            alert(
              `Please enter a title for frame image ${imgIdx + 1} in style ${
                style.styleName
              }`
            );
            setLoading(false);
            return;
          }
          if (!img.file && !img.imageUrl) {
            alert(
              `Please upload an image for frame image ${imgIdx + 1} in style ${
                style.styleName
              }`
            );
            setLoading(false);
            return;
          }

          for (let sizeIdx = 0; sizeIdx < img.sizes.length; sizeIdx++) {
            const size = img.sizes[sizeIdx];
            if (!size.label.trim() || !size.amount) {
              alert(
                `Please fill in all size details for frame image ${
                  imgIdx + 1
                } in style ${style.styleName}`
              );
              setLoading(false);
              return;
            }
          }
        }
      }
    }

    try {
      const formData = new FormData();
      formData.append("selectedShape", shape);
      formData.append("selectedColor", "Dummy");
      formData.append("selectedSize", "Dummy");
      formData.append("selectedFrameImage", "Dummy");
      formData.append("quantity", 1);

      if (userUploadedImage) {
        formData.append("userUploadedImage", userUploadedImage);
      } else {
        alert("Please upload a dummy user image");
        setLoading(false);
        return;
      }

      const shapeData = {
        shape,
        colorOptions: await Promise.all(
          colorOptions.map(async (color) => {
            const uploadedStyles = await Promise.all(
              color.styles.map(async (style) => {
                const uploadedImages = await Promise.all(
                  style.frameImages.map(async (img) => {
                    if (img.file) {
                      const imageForm = new FormData();
                      imageForm.append("frameImage", img.file);
                      const res = await axiosInstance.post(
                        "/framecustomize/upload-frame-image",
                        imageForm
                      );
                      return {
                        title: img.title,
                        imageUrl: res.data.url,
                        sizes: img.sizes,
                      };
                    } else if (img.imageUrl) {
                      return {
                        title: img.title,
                        imageUrl: img.imageUrl,
                        sizes: img.sizes,
                      };
                    } else {
                      throw new Error(
                        "All frame images must have a file or existing imageUrl"
                      );
                    }
                  })
                );
                return {
                  styleName: style.styleName,
                  frameImages: uploadedImages,
                };
              })
            );
            return {
              color: color.color,
              styles: uploadedStyles,
            };
          })
        ),
      };

      formData.append("shapeData", JSON.stringify(shapeData));

      if (initialData?._id) {
        await axiosInstance.put(`/framecustomize/${initialData._id}`, formData);
      } else {
        await axiosInstance.post("/framecustomize", formData);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);

      // Show specific error messages
      if (err.response?.data?.message) {
        if (err.response.data.message.includes("File size too large")) {
          alert(
            `File size too large! Please compress your images or use smaller files. Maximum size is ${MAX_UPLOAD_SIZE_MB}MB.`
          );
        } else {
          alert(`Error: ${err.response.data.message}`);
        }
      } else {
        alert("Something went wrong. Please check the console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg p-6">
      {/* Shape Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shape Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={shape}
          onChange={(e) => setShape(e.target.value)}
          className="block w-full px-4 py-2.5 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
          placeholder="Enter shape name (e.g., Rectangle, Circle, Heart...)"
        />
      </div>

      {/* User Image Upload */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
        <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-indigo-600" />
          Dummy User Image <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Check file size (10MB limit)
                if (file.size > MAX_UPLOAD_SIZE_BYTES) {
                  alert(
                    `File size too large. Maximum allowed size is ${MAX_UPLOAD_SIZE_MB}MB. Your file is ${(
                      file.size /
                      (1024 * 1024)
                    ).toFixed(1)}MB. The image will be compressed.`
                  );
                }

                try {
                  setCompressing(true);
                  // Compress the image
                  const compressedFile = await compressImage(file);
                  setUserUploadedImage(compressedFile);
                } catch (error) {
                  console.error("Error compressing user image:", error);
                  alert("Error processing image. Please try a different file.");
                } finally {
                  setCompressing(false);
                }
              }}
              className="hidden"
            />
            <div className="border-2 border-dashed border-indigo-300 rounded-lg p-6 text-center hover:bg-indigo-100 transition-colors duration-200">
              <Upload className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
              <p className="text-indigo-700 font-medium">
                {compressing ? "Compressing image..." : "Click to upload image"}
              </p>
              <p className="text-indigo-600 text-sm mt-1">
                {userUploadedImage ? userUploadedImage.name : "No file chosen"}
              </p>
            </div>
          </label>
          {userUploadedImage && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-indigo-300 shadow-sm">
              <img
                src={URL.createObjectURL(userUploadedImage)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      {/* Color Options */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label className="block text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-600" />
            Color & Style Options
          </label>
          <button
            type="button"
            onClick={addColor}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
          >
            <Plus className="w-4 h-4" />
            Add Color
          </button>
        </div>

        {colorOptions.map((color, colorIdx) => (
          <div
            key={colorIdx}
            className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm"
          >
            {/* Color Header */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Palette className="w-5 h-5 text-indigo-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Color name (e.g., Blue, White, Gold...)"
                    value={color.color}
                    onChange={(e) =>
                      handleColorChange(colorIdx, "color", e.target.value)
                    }
                    className="bg-transparent text-lg font-semibold text-gray-900 placeholder-gray-500 border-none focus:ring-0 px-0 min-w-[200px]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeColor(colorIdx)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Remove Color"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Styles */}
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <label className="block text-md font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  Styles for {color.color || "this color"}
                </label>
                <button
                  type="button"
                  onClick={() => addStyle(colorIdx)}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition"
                >
                  <Plus className="w-4 h-4" />
                  Add Style
                </button>
              </div>

              {color.styles.map((style, styleIdx) => (
                <div
                  key={styleIdx}
                  className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
                >
                  {/* Style Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <input
                          type="text"
                          placeholder="Style name (e.g., Classic Frame, Shade Frame, Modern Border...)"
                          value={style.styleName}
                          onChange={(e) =>
                            handleStyleChange(
                              colorIdx,
                              styleIdx,
                              "styleName",
                              e.target.value
                            )
                          }
                          className="bg-transparent text-base font-semibold text-gray-900 placeholder-gray-500 border-none focus:ring-0 px-0 min-w-[250px]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeStyle(colorIdx, styleIdx)}
                        className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                        title="Remove Style"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Frame Images */}
                  <div className="p-4 space-y-4">
                    {style.frameImages.map((img, imgIdx) => (
                      <div
                        key={imgIdx}
                        className="border border-gray-200 rounded-lg bg-white p-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-indigo-600" />
                            <span className="font-semibold text-gray-900">
                              Frame Image {imgIdx + 1}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              removeFrameImage(colorIdx, styleIdx, imgIdx)
                            }
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded transition"
                            title="Remove Frame Image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title Input */}
                        <div className="mb-4">
                          <input
                            type="text"
                            placeholder="Frame title (e.g., Floral Border, Classic Frame...)"
                            value={img.title}
                            onChange={(e) =>
                              handleFrameImageChange(
                                colorIdx,
                                styleIdx,
                                imgIdx,
                                "title",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2.5 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition"
                          />
                        </div>

                        {/* File Upload */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Frame Image <span className="text-red-500">*</span>
                          </label>
                          <div className="flex items-center gap-4">
                            <label className="flex-1 cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleFileChange(
                                    colorIdx,
                                    styleIdx,
                                    imgIdx,
                                    e.target.files[0]
                                  )
                                }
                                className="hidden"
                              />
                              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 hover:border-indigo-400 transition">
                                <Upload className="w-6 h-6 text-indigo-600 mx-auto mb-1" />
                                <p className="text-gray-700 text-sm font-medium">
                                  Upload frame image
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  {img.file ? img.file.name : "No file chosen"}
                                </p>
                              </div>
                            </label>
                            {(img.file || img.imageUrl) && (
                              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-indigo-300 shadow-sm">
                                <img
                                  src={
                                    img.file
                                      ? URL.createObjectURL(img.file)
                                      : img.imageUrl
                                  }
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.error(
                                      "Form image failed to load:",
                                      img.imageUrl
                                    );
                                    e.target.src =
                                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjE1TTkgMTJIMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Sizes */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Ruler className="w-4 h-4 text-indigo-600" />
                              Sizes & Pricing
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                addSize(colorIdx, styleIdx, imgIdx)
                              }
                              className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                              <Plus className="w-3 h-3" />
                              Add Size
                            </button>
                          </div>

                          <div className="space-y-3">
                            {img.sizes.map((size, sizeIdx) => (
                              <div
                                key={sizeIdx}
                                className="flex items-center gap-3"
                              >
                                <input
                                  type="text"
                                  placeholder="Size label (e.g., 8x10, A4...)"
                                  value={size.label}
                                  onChange={(e) =>
                                    handleSizeChange(
                                      colorIdx,
                                      styleIdx,
                                      imgIdx,
                                      sizeIdx,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                  className="flex-1 px-3 py-2 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                                />
                                <div className="relative flex-1">
                                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                    ₹
                                  </span>
                                  <input
                                    type="number"
                                    placeholder="Amount"
                                    value={size.amount}
                                    onChange={(e) =>
                                      handleSizeChange(
                                        colorIdx,
                                        styleIdx,
                                        imgIdx,
                                        sizeIdx,
                                        "amount",
                                        e.target.value
                                      )
                                    }
                                    className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 text-slate-900 rounded-lg focus:outline-indigo-600 focus:ring-2 focus:ring-indigo-200 transition text-sm"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSize(
                                      colorIdx,
                                      styleIdx,
                                      imgIdx,
                                      sizeIdx
                                    )
                                  }
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                                  disabled={img.sizes.length === 1}
                                  title={
                                    img.sizes.length === 1
                                      ? "At least one size required"
                                      : "Remove Size"
                                  }
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Frame Image Button */}
                    <button
                      type="button"
                      onClick={() => addFrameImage(colorIdx, styleIdx)}
                      className="flex items-center gap-2 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                    >
                      <Plus className="w-5 h-5" />
                      Add Another Frame Image to this Style
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{initialData ? "Update Frame" : "Create Frame"}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default FrameForm;
