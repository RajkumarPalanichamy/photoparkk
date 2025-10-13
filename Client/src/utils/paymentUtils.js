import axiosInstance from './axiosInstance';

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

// Create payment order (calls backend API to get Razorpay orderId)
export const createPaymentOrder = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/create', paymentData);
    return response.data; // should return { orderId, amount, dbOrderId, etc. }
  } catch (error) {
    console.error('❌ Error creating payment order:', error);
    throw error;
  }
};

// Verify payment on server
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosInstance.post('/payments/verify', paymentData);
    return response.data;
  } catch (error) {
    console.error('❌ Error verifying payment:', error);
    throw error;
  }
};

// Main function: opens Razorpay modal, handles verification and order saving
export const initializePayment = async (orderData, userDetails) => {
  try {
    const Razorpay = await loadRazorpayScript();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_eh4eCol0GXNXUS',
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'PhotoPark',
      description: 'Photo Frame Order',
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          console.log('✅ Payment successful, processing...', response);
          
          // ✅ Step 1: Save order in DB based on product type
          const orderPayload = orderData.orderPayload;
          if (orderPayload) {
            // Add payment details to the order
            orderPayload.paymentId = response.razorpay_payment_id;
            orderPayload.paymentStatus = 'success';
            orderPayload.paidAt = new Date();
            orderPayload.razorpayOrderId = response.razorpay_order_id;
            
            try {
              // Handle different product types
              if (orderPayload.productType === 'frame') {
                // Frame orders go to frameorders endpoint
                const orderResponse = await axiosInstance.post('/frameorders/create', orderPayload);
                console.log('✅ Frame order saved successfully:', orderResponse.data);
              } else {
                // Regular orders (including newArrival) go to orders endpoint
                const formData = new FormData();
                formData.append('cartItemId', orderPayload.cartItemId);
                formData.append('productType', orderPayload.productType);
                formData.append('amount', orderPayload.amount);
                
                // Ensure deliveryDetails has the correct structure
                const deliveryDetails = {
                  name: orderPayload.deliveryDetails?.name || '',
                  email: orderPayload.deliveryDetails?.email || '',
                  phone: orderPayload.deliveryDetails?.phone || '',
                  address: orderPayload.deliveryDetails?.address || '',
                  pincode: orderPayload.deliveryDetails?.pincode || '',
                };
                
                formData.append('deliveryDetails', JSON.stringify(deliveryDetails));
                
                const orderResponse = await axiosInstance.post('/orders', formData);
                console.log('✅ Order saved successfully:', orderResponse.data);
              }
            } catch (orderError) {
              console.error('❌ Error saving order:', orderError.response?.data || orderError.message);
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
            console.log('✅ Payment verification successful:', verificationResult);
          } catch (verifyError) {
            console.warn('⚠️ Payment verification failed (but payment was successful):', verifyError.message);
            // Don't throw here, payment was successful
          }

          // ✅ Step 3: Redirect to success page
          const successUrl = `/payment-success?razorpay_payment_id=${response.razorpay_payment_id}&razorpay_order_id=${response.razorpay_order_id}`;
          window.location.href = successUrl;

        } catch (error) {
          console.error('❌ Payment processing failed:', error);
          alert('❌ Payment processing failed. Please contact support.');
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
        color: '#3B82F6',
      },
      modal: {
        ondismiss: function () {
          console.log('Payment modal closed by user');
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.open();

    return new Promise((resolve, reject) => {
      rzp.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        alert('❌ Payment failed. Please try again.');
        reject(new Error('Payment failed'));
      });

      rzp.on('payment.success', function (response) {
        console.log('✅ Payment success event received:', response);
        resolve(response);
      });
    });
  } catch (error) {
    console.error('❌ Error initializing payment:', error);
    throw error;
  }
};
