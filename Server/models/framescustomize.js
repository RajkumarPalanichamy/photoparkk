
import mongoose from "mongoose";

// 📸 Each Frame Image → includes file + size options
const frameImageSchema = new mongoose.Schema(
  {
    title: { type: String },
    imageUrl: { type: String, required: true },
    sizes: [
      {
        label: { type: String, required: true }, // e.g. "8x10"
        amount: { type: Number, required: true }, // e.g. 499
      },
    ],
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: true }
);


// ✨ Each Style → contains multiple frame images
const styleSchema = new mongoose.Schema(
  {
    styleName: { type: String, required: true }, // Example: "Classic Frame"
    frameImages: [frameImageSchema],              // Array of frame images with sizes
  },
  { _id: true }
);

// 🎨 Each Color → contains multiple styles
const colorOptionSchema = new mongoose.Schema(
  {
    color: { type: String, required: true }, // Example: "Black"
    styles: [styleSchema],                   // Array of styles
  },
  { _id: true }
);

// 🔲 Each Shape → has multiple color options
const shapeSchema = new mongoose.Schema(
  {
    shape: { type: String, required: true },       // Example: "Portrait"
    colorOptions: [colorOptionSchema],             // All color variants under shape
  },
  { _id: false }
);

// 🧾 Final Main Schema → actual customization entry
const frameCustomizeSchema = new mongoose.Schema(
  {
    // Admin-defined shape data (all available frames/colors/sizes)
    shapeData: {
      type: shapeSchema,
      required: true,
    },

    // User selections
    selectedShape: { type: String, required: true },          // e.g., "Portrait"
    selectedColor: { type: String, required: true },          // e.g., "Black"
    selectedFrameImage: { type: String, required: true },     // e.g., "Elegant Black"
    selectedSize: { type: String, required: true },           // e.g., "8x10"
    quantity: { type: Number, required: true, min: 1 },       // e.g., 1 or more

    // Uploaded photo by user
    userUploadedImage: { type: String, required: true },      // File path or URL
  },
  { timestamps: true }
);

const FrameCustomize = mongoose.model("FrameCustomize", frameCustomizeSchema);
export default FrameCustomize;
