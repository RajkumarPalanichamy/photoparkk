// 📁 src/pages/Frames.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  MdFileUpload,
  MdCrop,
  MdColorLens,
  MdImage,
  MdStraighten,
  MdPreview,
  MdClose,
  MdShoppingCartCheckout,
  MdListAlt,
  MdCheckCircle,
  MdPhotoCamera,
  MdStyle,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";

const Frames = () => {
  const [frames, setFrames] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFrameImage, setSelectedFrameImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userImage, setUserImage] = useState(null);
  const [expandedStyles, setExpandedStyles] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/framecustomize")
      .then((res) => {
        console.log("Frames data:", res.data);
        setFrames(res.data.map((f) => f.shapeData));
      })
      .catch((err) => console.error("Error loading frames:", err));
  }, []);

  const toggleStyleExpansion = (color) => {
    setExpandedStyles((prev) => ({
      ...prev,
      [color]: !prev[color],
    }));
  };

  const handleBuyNow = () => {
    if (
      !userImage ||
      !selectedShape ||
      !selectedColor ||
      !selectedStyle ||
      !selectedSize ||
      !selectedFrameImage
    ) {
      alert("Please complete all selections and upload image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;

      const frameData = {
        shape: selectedShape.shape,
        color: selectedColor,
        style: selectedStyle,
        size: selectedSize.label,
        price: selectedSize.amount,
        quantity,
        title: selectedFrameImage.title,
        frameImageUrl: selectedFrameImage.imageUrl,
        userImageUrl: base64Image,
      };

      sessionStorage.setItem("checkoutFrameData", JSON.stringify(frameData));
      navigate("/frameCheckout");
    };

    reader.readAsDataURL(userImage);
  };

  const renderShape = () => {
    if (!userImage)
      return <p className="text-neutral-500">Upload image to see preview</p>;

    const shapeName = selectedShape?.shape;
    const imageUrl = URL.createObjectURL(userImage);
    const borderColor = selectedColor || "#ccc";

    const shapeClasses = {
      Hexagon: "mask-hexagon",
      Portrait: "mask-portrait",
      Landscape: "mask-landscape",
      Square: "mask-square",
      Rectangle: "mask-rectangle",
      Circle: "mask-circle",
      Oval: "mask-oval",
    };

    return (
      <div className="mx-auto w-80 h-80 bg-white flex items-center justify-center">
        <div
          className={`w-full h-full p-2 rounded-2xl border-[10px] shadow-2xl flex items-center justify-center transition-transform duration-300 hover:scale-105 ${shapeClasses[shapeName]}`}
          style={{ borderColor }}
        >
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      </div>
    );
  };

  // Get available styles for selected color
  const getAvailableStyles = () => {
    if (!selectedShape || !selectedColor) return [];
    const colorOption = selectedShape.colorOptions.find(
      (c) => c.color === selectedColor
    );
    return colorOption ? colorOption.styles : [];
  };

  // Get available frame images for selected style
  const getAvailableFrameImages = () => {
    if (!selectedShape || !selectedColor || !selectedStyle) return [];
    const colorOption = selectedShape.colorOptions.find(
      (c) => c.color === selectedColor
    );
    if (!colorOption) return [];
    const style = colorOption.styles.find((s) => s.styleName === selectedStyle);
    return style ? style.frameImages : [];
  };

  return (
    <div className="bg-neutral-50 pt-[80px] pb-6 px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary drop-shadow-lg mb-4">
          🖼️ Frame Customizer
        </h1>
        <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
          Create your perfect framed photo. Choose shape, color, style, and
          size.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-6xl mx-auto">
          {[
            { icon: <MdFileUpload size={24} />, label: "Upload Image" },
            { icon: <MdCrop size={24} />, label: "Choose Shape" },
            { icon: <MdColorLens size={24} />, label: "Pick Color" },
            { icon: <MdStyle size={24} />, label: "Select Style" },
            { icon: <MdImage size={24} />, label: "Choose Frame" },
            { icon: <MdStraighten size={24} />, label: "Pick Size" },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-neutral-200 shadow-lg w-36 hover:scale-105 transition-all duration-300 hover:shadow-xl"
            >
              <div className="text-primary mb-2">{step.icon}</div>
              <div className="text-center text-sm font-semibold text-neutral-700">
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
        {/* Preview Section */}
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-primary-light">
          <h2 className="text-2xl font-bold text-center text-primary-dark mb-6 flex items-center justify-center gap-2">
            <MdPreview /> Live Frame Preview
          </h2>
          {renderShape()}
          <div className="mt-6">
            <label className="block text-lg font-medium mb-2 text-secondary flex items-center gap-2">
              <MdPhotoCamera />
              Upload Your Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUserImage(e.target.files[0])}
              className="w-full px-4 py-3 border-2 border-dashed border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-200"
            />
            {userImage && (
              <div className="mt-3 p-3 bg-success-light border border-success rounded-lg">
                <div className="flex items-center gap-2 text-success">
                  <MdCheckCircle />
                  <span className="font-medium">
                    Image uploaded successfully!
                  </span>
                </div>
                <button
                  onClick={() => setUserImage(null)}
                  className="text-error underline text-sm mt-1 flex items-center gap-1 hover:text-error"
                >
                  <MdClose />
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Customization Section */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-primary-light">
          <h2 className="text-2xl font-bold text-primary-dark mb-6 flex items-center gap-2">
            <MdListAlt /> Customize Your Frame
          </h2>

          <div className="space-y-6">
            {/* Shape Selection */}
            <div>
              <label className="block text-lg font-semibold text-secondary mb-3">
                Select Shape
              </label>
              <select
                value={selectedShape?.shape || ""}
                onChange={(e) => {
                  const shape = frames.find((f) => f.shape === e.target.value);
                  setSelectedShape(shape);
                  setSelectedColor("");
                  setSelectedStyle("");
                  setSelectedSize("");
                  setSelectedFrameImage(null);
                }}
                className="block border-2 border-neutral-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-200"
              >
                <option value="">-- Choose Frame Shape --</option>
                {frames.map((f, i) => (
                  <option key={i} value={f.shape}>
                    {f.shape}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Selection */}
            {selectedShape && (
              <div>
                <label className="block text-lg font-semibold text-secondary mb-3">
                  Select Color
                </label>
                <select
                  value={selectedColor}
                  onChange={(e) => {
                    const color = e.target.value;
                    setSelectedColor(color);
                    setSelectedStyle("");
                    setSelectedSize("");
                    setSelectedFrameImage(null);

                    // Auto-select the first available frame image for this color
                    if (color && selectedShape) {
                      const colorOption = selectedShape.colorOptions.find(
                        (c) => c.color === color
                      );
                      if (
                        colorOption &&
                        colorOption.styles &&
                        colorOption.styles.length > 0
                      ) {
                        const firstStyle = colorOption.styles[0];
                        if (
                          firstStyle.frameImages &&
                          firstStyle.frameImages.length > 0
                        ) {
                          const firstFrameImage = firstStyle.frameImages[0];
                          setSelectedStyle(firstStyle.styleName);
                          setSelectedFrameImage(firstFrameImage);
                          // Auto-select the first size
                          if (
                            firstFrameImage.sizes &&
                            firstFrameImage.sizes.length > 0
                          ) {
                            setSelectedSize(firstFrameImage.sizes[0]);
                          }
                        }
                      }
                    }
                  }}
                  className="block border-2 border-neutral-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-200"
                >
                  <option value="">-- Choose Frame Color --</option>
                  {selectedShape.colorOptions.map((c, i) => (
                    <option key={i} value={c.color}>
                      {c.color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Selected Frame Design Preview */}
            {selectedFrameImage && (
              <div className="bg-primary-light border-2 border-primary-light rounded-xl p-4">
                <h3 className="text-lg font-semibold text-primary-dark mb-3 flex items-center gap-2">
                  <MdCheckCircle className="text-success" />
                  Selected Frame Design
                </h3>
                <div className="flex gap-4 items-center">
                  <img
                    src={selectedFrameImage.imageUrl}
                    alt={selectedFrameImage.title}
                    className="w-20 h-20 object-cover rounded-lg border-2 border-primary-light"
                    onError={(e) => {
                      console.error(
                        "Selected frame image failed to load:",
                        selectedFrameImage.imageUrl
                      );
                      e.target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjE1TTkgMTJIMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-secondary">
                      {selectedFrameImage.title}
                    </h4>
                    <p className="text-sm text-primary-hover">
                      Color: {selectedColor}
                    </p>
                    <p className="text-sm text-primary-hover">
                      Style: {selectedStyle}
                    </p>
                    {selectedSize && (
                      <p className="text-sm text-primary-hover">
                        Size: {selectedSize.label} - ₹{selectedSize.amount}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-primary mt-2">
                  💡 This frame design will be used for your photo. You can
                  change it by selecting a different color above.
                </p>
              </div>
            )}

            {/* Style Selection - Optional */}
            {selectedColor && getAvailableStyles().length > 1 && (
              <div>
                <label className="block text-lg font-semibold text-secondary mb-3">
                  Change Style (Optional)
                  <span className="text-sm font-normal text-neutral-600 ml-2">
                    - Currently using "{selectedStyle}"
                  </span>
                </label>
                <select
                  value={selectedStyle}
                  onChange={(e) => {
                    setSelectedStyle(e.target.value);
                    setSelectedSize("");
                    setSelectedFrameImage(null);
                  }}
                  className="block border-2 border-neutral-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-200"
                >
                  <option value="">-- Choose Frame Style --</option>
                  {getAvailableStyles().map((style, i) => (
                    <option key={i} value={style.styleName}>
                      {style.styleName}
                    </option>
                  ))}
                </select>

                {/* Style Preview Section */}
                <div className="mt-4">
                  <button
                    onClick={() => toggleStyleExpansion(selectedColor)}
                    className="flex items-center gap-2 text-primary hover:text-primary-hover font-medium"
                  >
                    {expandedStyles[selectedColor] ? (
                      <MdExpandLess />
                    ) : (
                      <MdExpandMore />
                    )}
                    {expandedStyles[selectedColor] ? "Hide" : "Show"} Style
                    Previews
                  </button>

                  {expandedStyles[selectedColor] && (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      {getAvailableStyles().map((style, styleIdx) => (
                        <div
                          key={styleIdx}
                          className="border border-neutral-200 rounded-lg p-3 bg-neutral-50"
                        >
                          <h4 className="font-semibold text-secondary text-sm mb-2">
                            {style.styleName}
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {style.frameImages
                              .slice(0, 2)
                              .map((frame, frameIdx) => {
                                console.log("Frame image URL:", frame.imageUrl);
                                return (
                                  <img
                                    key={frameIdx}
                                    src={frame.imageUrl}
                                    alt={frame.title}
                                    className="w-full h-16 object-cover rounded border"
                                    onError={(e) => {
                                      console.error(
                                        "Image failed to load:",
                                        frame.imageUrl
                                      );
                                      e.target.style.display = "none";
                                    }}
                                  />
                                );
                              })}
                          </div>
                          {style.frameImages.length > 2 && (
                            <p className="text-xs text-neutral-500 mt-1">
                              +{style.frameImages.length - 2} more frames
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Frame Image Selection - Optional */}
            {selectedStyle && getAvailableFrameImages().length > 1 && (
              <div>
                <label className="block text-lg font-semibold text-secondary mb-3">
                  Change Frame Design (Optional)
                  <span className="text-sm font-normal text-neutral-600 ml-2">
                    - Currently using "{selectedFrameImage?.title}"
                  </span>
                </label>
                <div className="space-y-4">
                  {getAvailableFrameImages().map((frame, frameIdx) => (
                    <div
                      key={frameIdx}
                      className="border-2 border-neutral-200 rounded-xl p-4 bg-white hover:border-primary transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <img
                          src={frame.imageUrl}
                          alt={frame.title}
                          className="w-24 h-24 object-cover rounded-lg border"
                          onError={(e) => {
                            console.error(
                              "Image failed to load:",
                              frame.imageUrl
                            );
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMiA5VjE1TTkgMTJIMTUiIHN0cm9rZT0iIzlDQTNBRiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+";
                          }}
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg text-secondary mb-2">
                            {frame.title}
                          </h4>
                          <label className="block text-sm font-medium text-neutral-700 mb-2">
                            Available Sizes:
                          </label>
                          <select
                            className="w-full border border-neutral-300 p-2 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-primary"
                            onChange={(e) => {
                              const selected = frame.sizes.find(
                                (s) => s.label === e.target.value
                              );
                              setSelectedSize(selected);
                              setSelectedFrameImage(frame);
                            }}
                          >
                            <option value="">-- Select Size --</option>
                            {frame.sizes.map((size, sizeIdx) => (
                              <option key={sizeIdx} value={size.label}>
                                {size.label} - ₹{size.amount}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {selectedFrameImage && (
              <div>
                <label className="block text-lg font-semibold text-secondary mb-3">
                  Select Size
                </label>
                <select
                  value={selectedSize?.label || ""}
                  onChange={(e) => {
                    const selected = selectedFrameImage.sizes.find(
                      (s) => s.label === e.target.value
                    );
                    setSelectedSize(selected);
                  }}
                  className="block border-2 border-neutral-300 w-full p-3 rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-200"
                >
                  <option value="">-- Choose Frame Size --</option>
                  {selectedFrameImage.sizes.map((size, sizeIdx) => (
                    <option key={sizeIdx} value={size.label}>
                      {size.label} - ₹{size.amount}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Selection */}
            {selectedSize && (
              <div>
                <label className="block text-lg font-semibold text-secondary mb-3">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="border-2 border-neutral-300 mt-2 p-3 w-full rounded-xl focus:ring-2 focus:ring-primary-light focus:border-primary transition-all duration-200"
                />
              </div>
            )}

            {/* Order Summary */}
            {selectedShape &&
              selectedColor &&
              selectedStyle &&
              selectedFrameImage &&
              selectedSize && (
                <div className="mt-6 p-6 bg-primary rounded-2xl border-2 border-primary-light shadow-lg">
                  <h3 className="text-xl font-bold text-center text-primary-dark mb-4 flex items-center justify-center gap-2">
                    <MdListAlt />
                    Order Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <p>
                        <strong>Shape:</strong> {selectedShape.shape}
                      </p>
                      <p>
                        <strong>Color:</strong> {selectedColor}
                      </p>
                      <p>
                        <strong>Style:</strong> {selectedStyle}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p>
                        <strong>Frame:</strong> {selectedFrameImage.title}
                      </p>
                      <p>
                        <strong>Size:</strong> {selectedSize.label}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹{selectedSize.amount}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary-light">
                    <p className="text-lg font-bold text-success text-center">
                      Total: ₹{selectedSize.amount * quantity}
                    </p>
                  </div>
                </div>
              )}

            {/* Buy Now Button */}
            {selectedSize && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleBuyNow}
                  className="bg-primary text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3 text-lg font-semibold"
                >
                  <MdShoppingCartCheckout size={24} />
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frames;
