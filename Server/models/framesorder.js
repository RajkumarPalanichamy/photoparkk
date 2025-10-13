import mongoose from "mongoose";

const frameorderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        title: String,
        frameImageUrl: String,
        userImageUrl: String,
        shape: String,
        color: String,
        size: String,
        price: Number,
        quantity: Number,
        total: Number,
      },
    ],
    shippingDetails: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      state: String,
      district: String,
      city: String,
      pincode: String,
    },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.model("FrameOrders", frameorderSchema);
