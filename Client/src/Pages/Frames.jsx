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
  MdSquareFoot,
  MdPhotoCamera,
} from "react-icons/md";

const Frames = () => {
  const [frames, setFrames] = useState([]);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedFrameImage, setSelectedFrameImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [userImage, setUserImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/framecustomize")
      .then((res) => {
        setFrames(res.data.map((f) => f.shapeData));
      })
      .catch((err) => console.error("Error loading frames:", err));
  }, []);

  const handleBuyNow = () => {
    if (
      !userImage ||
      !selectedShape ||
      !selectedColor ||
      !selectedSize ||
      !selectedFrameImage
    ) {
      alert("Please complete all selections and upload image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      // Build static asset URL against server root, not "/api"
      const safeFrameImageUrl = `/${selectedFrameImage.imageUrl.replace(
        /\\/g,
        "/"
      )}`;

      const frameData = {
        shape: selectedShape.shape,
        color: selectedColor,
        size: selectedSize.label,
        price: selectedSize.amount,
        quantity,
        title: selectedFrameImage.title,
        frameImageUrl: safeFrameImageUrl,
        userImageUrl: base64Image,
      };

      sessionStorage.setItem("checkoutFrameData", JSON.stringify(frameData));
      navigate("/frameCheckout");
    };

    reader.readAsDataURL(userImage);
  };

  const renderShape = () => {
    if (!userImage) return <p className="text-gray-500">Upload image</p>;

    const shapeName = selectedShape?.shape;
    const imageUrl = URL.createObjectURL(userImage);
    const borderColor = selectedColor || "#ccc";

    const shapeClasses = {
      Hexagon: "mask-hexagon",
      Portrait: "mask-portrait",
      Landscape: "mask-landscape",
      Square: "mask-square",
    };

    return (
      <div className="mx-auto w-80 h-80 bg-[#fffcf2]  flex items-center justify-center">
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

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-500 drop-shadow-xl">
          Frame Customizer
        </h1>

        <div className="mt-8 flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          {[
            { icon: <MdFileUpload size={24} />, label: "Upload Image" },
            { icon: <MdCrop size={24} />, label: "Choose Shape" },
            { icon: <MdColorLens size={24} />, label: "Choose Colour" },
            { icon: <MdImage size={24} />, label: "Select Frame" },
            { icon: <MdStraighten size={24} />, label: "Pick Size" },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center bg-white p-4 rounded-xl border shadow-md w-36 hover:scale-105 transition"
            >
              <div className="text-blue-600 mb-2">{step.icon}</div>
              <div className="text-center text-sm font-medium text-gray-700">
                {step.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-7xl mx-auto">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-purple-200">
          <h2 className="text-2xl font-bold text-center text-blue-800 mb-6 flex items-center justify-center gap-2">
            <MdPreview /> Live Frame Preview
          </h2>
          {renderShape()}
          <div className="mt-6">
            <label className="block text-lg font-medium mb-2 text-gray-800 flex items-center gap-2">
              <MdPhotoCamera />
              Upload or Replace Your Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUserImage(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {userImage && (
              <div className="mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-2 text-green-600">
                  <MdCheckCircle />
                  Image uploaded successfully.
                </div>
                <button
                  onClick={() => setUserImage(null)}
                  className="text-red-600 underline text-sm mt-1 flex items-center gap-1"
                >
                  <MdClose />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <MdListAlt /> Customize Options
          </h2>

          <label className="font-medium">Select Shape</label>
          <select
            value={selectedShape?.shape || ""}
            onChange={(e) => {
              const shape = frames.find((f) => f.shape === e.target.value);
              setSelectedShape(shape);
              setSelectedColor("");
              setSelectedSize("");
              setSelectedFrameImage(null);
            }}
            className="block border w-full p-2 mb-4 rounded-lg"
          >
            <option value="">-- Choose Shape --</option>
            {frames.map((f, i) => (
              <option key={i} value={f.shape}>
                {f.shape}
              </option>
            ))}
          </select>

          {selectedShape && (
            <>
              <label className="font-medium">Select Color</label>
              <select
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="block border w-full p-2 mb-4 rounded-lg"
              >
                <option value="">-- Choose Color --</option>
                {selectedShape.colorOptions.map((c, i) => (
                  <option key={i} value={c.color}>
                    {c.color}
                  </option>
                ))}
              </select>
            </>
          )}

          {selectedColor &&
            selectedShape.colorOptions
              .find((c) => c.color === selectedColor)
              ?.frameImages.map((frame, i) => (
                <div key={i} className="border p-3 mb-3 rounded-lg bg-gray-50">
                  <p className="font-semibold text-lg">{frame.title}</p>
                  <img
                    src={`/${frame.imageUrl.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={frame.title}
                    className="w-full h-32 object-cover rounded mb-2 border"
                  />
                  <label>Choose Size:</label>
                  <select
                    className="w-full border p-2 rounded"
                    onChange={(e) => {
                      const selected = frame.sizes.find(
                        (s) => s.label === e.target.value
                      );
                      setSelectedSize(selected);
                      setSelectedFrameImage(frame);
                    }}
                  >
                    <option value="">-- Select --</option>
                    {frame.sizes.map((size, j) => (
                      <option key={j} value={size.label}>
                        {size.label} - ₹{size.amount}
                      </option>
                    ))}
                  </select>
                </div>
              ))}

          {selectedSize && (
            <div className="mt-4">
              <label className="font-medium">Quantity:</label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="border mt-2 p-2 w-full rounded-lg"
              />
            </div>
          )}

          {selectedShape &&
            selectedColor &&
            selectedFrameImage &&
            selectedSize && (
              <div className="mt-8 p-5 bg-yellow-50 rounded-xl border shadow text-lg space-y-2">
                <h3 className="text-xl font-bold text-center text-yellow-800 flex items-center justify-center gap-2">
                  <MdListAlt />
                  Order Summary
                </h3>
                <p>
                  <strong>Shape:</strong> {selectedShape.shape}
                </p>
                <p>
                  <strong>Color:</strong> {selectedColor}
                </p>
                <p>
                  <strong>Frame:</strong> {selectedFrameImage.title}
                </p>
                <p>
                  <strong>Size:</strong> {selectedSize.label}
                </p>
                <p>
                  <strong>Price:</strong> ₹{selectedSize.amount}
                </p>
                <p>
                  <strong>Quantity:</strong> {quantity}
                </p>
                <p className="text-green-700 font-bold">
                  Total: ₹{selectedSize.amount * quantity}
                </p>
              </div>
            )}

          {selectedSize && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleBuyNow}
                className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 flex items-center gap-2"
              >
                <MdShoppingCartCheckout />
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Frames;
