import axiosInstance from "./axiosInstance";

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    // Check if script is already being loaded
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );
    if (existingScript) {
      existingScript.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(
            new Error("Razorpay script loaded but Razorpay object not found")
          );
        }
      };
      existingScript.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      return;
    }

    // Create and load new script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      if (window.Razorpay) {
        resolve(window.Razorpay);
      } else {
        reject(
          new Error("Razorpay script loaded but Razorpay object not found")
        );
      }
    };
    script.onerror = () =>
      reject(
        new Error(
          "Failed to load Razorpay script. Please check your internet connection."
        )
      );
    document.body.appendChild(script);
  });
};

// Create payment order (calls backend API to get Razorpay orderId)
export const createPaymentOrder = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payments/create", paymentData);
    return response.data; // should return { orderId, amount, dbOrderId, etc. }
  } catch (error) {
    console.error("❌ Error creating payment order:", error);
    throw error;
  }
};

// Verify payment on server
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post("/payments/verify", paymentData);
    return response.data;
  } catch (error) {
    console.error("❌ Error verifying payment:", error);
    throw error;
  }
};

// Main function: opens Razorpay modal, handles verification and order saving
export const initializePayment = async (orderData, userDetails) => {
  try {
    const Razorpay = await loadRazorpayScript();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_eh4eCol0GXNXUS",
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "PhotoPark",
      description: "Photo Frame Order",
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          console.log("✅ Payment successful, processing...", response);

          // ✅ Step 1: Save order in DB based on product type
          const orderPayload = orderData.orderPayload;
          if (orderPayload) {
            // Add payment details to the order
            orderPayload.paymentId = response.razorpay_payment_id;
            orderPayload.paymentStatus = "success";
            orderPayload.paidAt = new Date();
            orderPayload.razorpayOrderId = response.razorpay_order_id;

            try {
              // Handle different product types
              if (orderPayload.productType === "frame") {
                // Frame orders go to frameorders endpoint
                const orderResponse = await axiosInstance.post(
                  "/frameorders/create",
                  orderPayload
                );
                console.log(
                  "✅ Frame order saved successfully:",
                  orderResponse.data
                );
              } else {
                // Regular orders (including newArrival) go to orders endpoint
                const formData = new FormData();
                formData.append("cartItemId", orderPayload.cartItemId);
                formData.append("productType", orderPayload.productType);
                formData.append("amount", String(orderPayload.amount));

                // Include ALL delivery details with complete structure
                const deliveryDetails = {
                  name: orderPayload.deliveryDetails?.name || "",
                  email: orderPayload.deliveryDetails?.email || "",
                  phone: orderPayload.deliveryDetails?.phone || "",
                  address: orderPayload.deliveryDetails?.address || "",
                  state: orderPayload.deliveryDetails?.state || "",
                  district: orderPayload.deliveryDetails?.district || "",
                  city: orderPayload.deliveryDetails?.city || "",
                  pincode: orderPayload.deliveryDetails?.pincode || "",
                  shippingCharge:
                    orderPayload.deliveryDetails?.shippingCharge || 0,
                  itemsTotal: orderPayload.deliveryDetails?.itemsTotal || 0,
                };

                formData.append(
                  "deliveryDetails",
                  JSON.stringify(deliveryDetails)
                );

                const orderResponse = await axiosInstance.post(
                  "/orders",
                  formData
                );
                console.log("✅ Order saved successfully:", orderResponse.data);
              }
            } catch (orderError) {
              console.error(
                "❌ Error saving order:",
                orderError.response?.data || orderError.message
              );
              // Don't throw here, continue with verification
            }
          }

          // ✅ Step 2: Verify payment (optional - for logging)
          try {
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            console.log(
              "✅ Payment verification successful:",
              verificationResult
            );
          } catch (verifyError) {
            console.warn(
              "⚠️ Payment verification failed (but payment was successful):",
              verifyError.message
            );
            // Don't throw here, payment was successful
          }

          // ✅ Step 3: Redirect to success page
          const successUrl = `/payment-success?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}`;
          window.location.href = successUrl;
        } catch (error) {
          console.error("❌ Payment processing failed:", error);
          // Show user-friendly error message
          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Payment processing failed. Please contact support.";
          alert(`❌ ${errorMessage}`);
          // Don't redirect on error, let user try again
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      notes: {
        address: userDetails.address,
      },
      theme: {
        color: "#3B82F6",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment modal closed by user");
          // This will be handled by the promise rejection in the return statement
        },
      },
    };

    // Track payment state
    let paymentResolved = false;
    let rejectPayment;

    const rzp = new Razorpay({
      ...options,
      modal: {
        ...options.modal,
        ondismiss: function () {
          console.log("Payment modal closed by user");
          if (!paymentResolved && rejectPayment) {
            paymentResolved = true;
            rejectPayment(new Error("Payment cancelled by user"));
          }
        },
      },
    });

    return new Promise((resolve, reject) => {
      rejectPayment = reject;

      rzp.on("payment.failed", function (response) {
        if (paymentResolved) return;
        paymentResolved = true;
        console.error("❌ Payment failed:", response.error);
        const errorMessage =
          response.error?.description ||
          response.error?.reason ||
          "Payment failed. Please try again.";
        alert(`❌ ${errorMessage}`);
        reject(new Error("Payment failed"));
      });

      rzp.on("payment.success", function (response) {
        if (paymentResolved) return;
        paymentResolved = true;
        console.log("✅ Payment success event received:", response);
        // Note: The handler function will handle the actual processing
        resolve(response);
      });

      rzp.open();
    });
  } catch (error) {
    console.error("❌ Error initializing payment:", error);
    throw error;
  }
};
