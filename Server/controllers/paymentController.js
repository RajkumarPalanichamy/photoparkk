// controllers/paymentController.js
import crypto from "crypto";
import razorpay from "../utils/razorpayInstance.js";
import Frame from "../models/framesorder.js";
import Order from "../models/orders.js";

export const createOrder = async (req, res) => {
  try {
    const { amount, cartItemId, productType, deliveryDetails } = req.body;
    
    // Generate a unique receipt ID (max 40 chars for Razorpay)
    // Use a shorter timestamp and truncate cartItemId if needed
    const shortTimestamp = Date.now().toString().slice(-8); // Last 8 digits
    const shortCartId = (cartItemId ? String(cartItemId) : "no_cart").slice(0, 20); // Max 20 chars
    const receipt = `rcpt_${shortCartId}_${shortTimestamp}`;

    const safeAmount = Number(amount);
    if (!safeAmount || safeAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: Math.round(safeAmount * 100), // ₹ to paisa
      currency: 'INR',
      receipt,
    };

    const order = await razorpay.orders.create(options);
    
    // Return order data with additional info needed for payment processing
    res.status(200).json({ 
      orderId: order.id, 
      currency: order.currency, 
      amount: order.amount,
      orderPayload: {
        userId: req.user._id,
        cartItemId,
        productType,
        deliveryDetails,
        razorpayOrderId: order.id,
        amount: amount,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    console.log('🔍 Verifying payment:', { razorpay_order_id, razorpay_payment_id });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Signature mismatch:', { expectedSignature, razorpay_signature });
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    console.log('✅ Payment signature verified successfully');
    res.status(200).json({ 
      success: true, 
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ error: "Failed to verify payment", details: err.message });
  }
};
