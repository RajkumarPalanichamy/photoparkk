import React from "react";
import {
  Truck,
  RefreshCcw,
  ShieldCheck,
  Heart,
  Package,
  Star,
  Percent,
} from "lucide-react";

import GooglePay from "../../assets/frontend_assets/ShippingDetails/googlePay.png";
import Paytm from "../../assets/frontend_assets/ShippingDetails/paytm.png";
import upi from "../../assets/frontend_assets/ShippingDetails/bhimIcon.png";
import visa from "../../assets/frontend_assets/ShippingDetails/visa.png";
import masterCard from "../../assets/frontend_assets/ShippingDetails/mastercard.png";
import Bank from "../../assets/frontend_assets/ShippingDetails/bank.png";
import Razorpay from "../../assets/frontend_assets/ShippingDetails/Razorpay.jpg";

const ShippingDetails = () => {
  const paymentMethods = [
    { name: "Google Pay", image: GooglePay },
    { name: "Paytm", image: Paytm },
    { name: "UPI", image: upi },
    { name: "Visa", image: visa },
    { name: "MasterCard", image: masterCard },
    { name: "Bank Transfer", image: Bank },
    { name: "Razorpay", image: Razorpay },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
      {/* Brand and Promise */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="p-3 bg-primary-light rounded-full">
            <ShieldCheck className="text-primary" size={32} />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
          PhotoParkk Promise
        </h2>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          We stand behind every product we make. If our products fail to live up
          to your standards, you can return them for a replacement or refund.
        </p>
        <p className="font-bold mt-3 text-secondary text-xl">
          - No Questions Asked
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="group p-6 rounded-2xl bg-gradient-to-br from-primary-light to-white border-2 border-primary/20 hover:border-primary transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-primary rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <Truck className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-secondary">FREE SHIPPING</h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            About shipping charges? No worries, it's completely on us.
          </p>
        </div>

        <div className="group p-6 rounded-2xl bg-gradient-to-br from-success-light to-white border-2 border-success/20 hover:border-success transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-success rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <RefreshCcw className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-secondary">
              30 DAYS RETURNS
            </h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            We provide 30 days hassle-free returns & refunds.
          </p>
        </div>

        <div className="group p-6 rounded-2xl bg-gradient-to-br from-warning-light to-white border-2 border-warning/20 hover:border-warning transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-warning rounded-xl mr-4 group-hover:scale-110 transition-transform">
              <Percent className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-secondary">10% DISCOUNT</h3>
          </div>
          <p className="text-neutral-600 leading-relaxed">
            With every order placed, you'll receive a 10% discount.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-16">
        <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-8 text-center">
          Our Numbers Speak
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-error-light rounded-full mb-4">
              <Heart className="text-error" size={28} />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              2 LAKH +
            </p>
            <p className="text-neutral-600 font-medium">Happy Customers</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-light rounded-full mb-4">
              <Package className="text-primary" size={28} />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              2 LAKH +
            </p>
            <p className="text-neutral-600 font-medium">Products Delivered</p>
          </div>
          <div className="text-center p-6 rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-warning-light rounded-full mb-4">
              <Star className="text-warning" size={28} />
            </div>
            <p className="text-3xl md:text-4xl font-bold text-secondary mb-2">
              2730 +
            </p>
            <p className="text-neutral-600 font-medium">Google Reviews</p>
          </div>
        </div>
      </div>

      {/* Secure Payments */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="p-3 bg-success-light rounded-full">
            <ShieldCheck className="text-success" size={28} />
          </div>
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-secondary mb-3">
          100% SECURE PAYMENTS
        </h3>
        <p className="text-neutral-600 mb-8 text-lg max-w-2xl mx-auto">
          We support all major payment methods for your convenience.
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 max-w-4xl mx-auto">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="flex justify-center items-center h-24 rounded-xl bg-white hover:bg-neutral-50 transition-all duration-300 border-2 border-neutral-200 hover:border-primary hover:shadow-md group"
              title={method.name}
            >
              <img
                src={method.image}
                alt={method.name}
                className="h-12 object-contain group-hover:scale-110 transition-transform"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
