// models/orders.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  cartItemId: { type: mongoose.Schema.Types.ObjectId, ref: "AddToCart", required: false },
  productType: { type: String, required: true },
  deliveryDetails: {
    name: String,
    email: String,
    phone: String,
    address: String,
    pincode: String,
  },
  image: { type: String }, // Cloudinary image URL
  status: { type: String, default: "Pending", enum: ["Pending", "Shipped", "Out for Delivery", "Delivered", "Cancelled"] },
  amount: { type: Number, required: true },
  paymentId: { type: String },
  paymentStatus: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  paidAt: { type: Date },
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
