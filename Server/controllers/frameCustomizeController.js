import FrameCustomize from "../models/framescustomize.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Create new FrameCustomize with Cloudinary upload
export const createFrameCustomize = async (req, res) => {
  try {
    const {
      shapeData,
      selectedShape,
      selectedColor,
      selectedFrameImage,
      selectedSize,
      quantity,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "userUploadedImage is required" });
    }

    // Upload image to Cloudinary
    const cloudUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "framescustomize" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const newFrame = new FrameCustomize({
      shapeData: JSON.parse(shapeData),
      selectedShape,
      selectedColor,
      selectedFrameImage,
      selectedSize,
      quantity,
      userUploadedImage: cloudUpload.secure_url,
    });

    const saved = await newFrame.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Upload a frame image (used in admin form)
export const uploadFrameImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const cloudUpload = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "framescustomize/frames" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.json({ url: cloudUpload.secure_url });
  } catch (err) {
    console.error("Upload frame image error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all
export const getAllFrames = async (req, res) => {
  try {
    const data = await FrameCustomize.find().sort({ createdAt: -1 });
    
    // Transform old data structure to new structure for backward compatibility
    const transformedData = data.map(item => {
      if (item.shapeData && item.shapeData.colorOptions) {
        item.shapeData.colorOptions = item.shapeData.colorOptions.map(color => {
          // If color has frameImages directly (old structure), wrap them in a default style
          if (color.frameImages && !color.styles) {
            console.log(`Transforming old structure for color: ${color.color}`);
            return {
              color: color.color,
              styles: [{
                styleName: "Default Style",
                frameImages: color.frameImages.map(frame => ({
                  ...frame,
                  imageUrl: frame.imageUrl // Ensure imageUrl is preserved
                }))
              }]
            };
          }
          // If color already has styles (new structure), return as is
          return color;
        });
      }
      return item;
    });
    
    res.json(transformedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get by ID
export const getFrameById = async (req, res) => {
  try {
    const item = await FrameCustomize.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    // Transform old data structure to new structure for backward compatibility
    if (item.shapeData && item.shapeData.colorOptions) {
      item.shapeData.colorOptions = item.shapeData.colorOptions.map(color => {
        // If color has frameImages directly (old structure), wrap them in a default style
        if (color.frameImages && !color.styles) {
          return {
            color: color.color,
            styles: [{
              styleName: "Default Style",
              frameImages: color.frameImages.map(frame => ({
                ...frame,
                imageUrl: frame.imageUrl // Ensure imageUrl is preserved
              }))
            }]
          };
        }
        // If color already has styles (new structure), return as is
        return color;
      });
    }
    
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update
export const updateFrameById = async (req, res) => {
  try {
    const {
      shapeData,
      selectedShape,
      selectedColor,
      selectedFrameImage,
      selectedSize,
      quantity,
    } = req.body;

    const updates = {};
    if (shapeData) updates.shapeData = JSON.parse(shapeData);
    if (selectedShape) updates.selectedShape = selectedShape;
    if (selectedColor) updates.selectedColor = selectedColor;
    if (selectedFrameImage) updates.selectedFrameImage = selectedFrameImage;
    if (selectedSize) updates.selectedSize = selectedSize;
    if (quantity) updates.quantity = quantity;

    // if new image provided, upload to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "framescustomize" },
          (error, cloudinaryResult) => {
            if (error) reject(error);
            else resolve(cloudinaryResult);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      updates.userUploadedImage = result.secure_url;
    }

    const updated = await FrameCustomize.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: "Item not found" });

    res.json(updated);
  } catch (err) {
    console.error("PUT Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete
export const deleteFrameById = async (req, res) => {
  try {
    const item = await FrameCustomize.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
