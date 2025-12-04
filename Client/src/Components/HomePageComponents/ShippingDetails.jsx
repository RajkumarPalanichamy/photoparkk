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
    <div className="px-6 py-10 max-w-6xl mx-auto font-[poppins]">
      {/* Brand and Promise */}
      <div className="border-b pb-5">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
          <ShieldCheck className="mr-2 text-indigo-600" size={24} />
          PhotoParkk Promise
        </h2>
        <p className="mt-2 text-gray-600 leading-relaxed">
          We stand behind every product we make. If our products fail to live up
          to your standards, you can return them for a replacement or refund.
        </p>
        <p className="font-semibold mt-1 text-gray-800">- No Questions Asked</p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
        <div className="p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-300 border border-blue-100">
          <div className="flex items-center mb-2">
            <Truck className="text-blue-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              FREE SHIPPING
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            About shipping charges? No worries, it's completely on us.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-300 border border-green-100">
          <div className="flex items-center mb-2">
            <RefreshCcw className="text-green-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              30 DAYS RETURNS
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            We provide 30 days hassle-free returns & refunds.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 transition-colors duration-300 border border-amber-100">
          <div className="flex items-center mb-2">
            <Percent className="text-amber-600 mr-2" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              10% DISCOUNT
            </h3>
          </div>
          <p className="text-sm text-gray-600">
            With every order placed, you'll receive a 10% discount.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 mt-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Our Numbers Speak
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-center mb-2">
              <Heart className="text-rose-500" size={20} />
            </div>
            <p className="text-xl font-bold text-gray-800">2 LAKH +</p>
            <p className="text-sm text-gray-600">Happy Customers</p>
          </div>
          <div className="p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-center mb-2">
              <Package className="text-indigo-500" size={20} />
            </div>
            <p className="text-xl font-bold text-gray-800">2 LAKH +</p>
            <p className="text-sm text-gray-600">Products Delivered</p>
          </div>
          <div className="p-3 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-center mb-2">
              <Star className="text-amber-500" size={20} />
            </div>
            <p className="text-xl font-bold text-gray-800">2730 +</p>
            <p className="text-sm text-gray-600">Google Reviews</p>
          </div>
        </div>
      </div>

      {/* Secure Payments */}
      <div className="border-t pt-5 mt-5">
        <div className="flex items-center mb-3">
          <ShieldCheck className="text-green-600 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">
            100% SECURE PAYMENTS
          </h3>
        </div>
        <p className="text-gray-600 mb-4 text-sm">
          We support all major payment methods for your convenience.
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-4 items-center">
          {paymentMethods.map((method, index) => (
            <div
              key={index}
              className="flex justify-center items-center h-20 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300 border border-gray-100"
              title={method.name}
            >
              <img
                src={method.image}
                alt={method.name}
                className="h-10 object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
