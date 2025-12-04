import React, { useState } from "react";
import NewArrivalProducts from "./AdminProductsEdit/NewArrivals/NewArrivalProducts";
import SpecialOffersProducts from "./AdminProductsEdit/SpecialOffers/SpecialOffersProuducts";
import { Package, Sparkles, Gift } from "lucide-react";

const AdminProducts = () => {
  const [activeTab, setActiveTab] = useState("newarrivals");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Package className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-500 mt-1">
              Manage your product catalog and inventory
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-600 border-b border-gray-200 mb-6">
        <li className="me-2">
          <button
            onClick={() => setActiveTab("newarrivals")}
            className={`inline-flex items-center gap-2 p-4 rounded-t-lg transition-colors ${
              activeTab === "newarrivals"
                ? "text-indigo-600 bg-gray-100"
                : "hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            New Arrivals
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("specialoffers")}
            className={`inline-flex items-center gap-2 p-4 rounded-t-lg transition-colors ${
              activeTab === "specialoffers"
                ? "text-indigo-600 bg-gray-100"
                : "hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            <Gift className="w-4 h-4" />
            Special Offers
          </button>
        </li>
      </ul>

      {/* Tab Content */}
       <div>
        {activeTab === "newarrivals" ? (
          <NewArrivalProducts />
        ) : (
          <SpecialOffersProducts />
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
