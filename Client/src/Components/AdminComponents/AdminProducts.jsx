import React, { useState } from "react";
import NewArrivalProducts from "./AdminProductsEdit/NewArrivals/NewArrivalProducts";
import { Package, Sparkles } from "lucide-react";

const AdminProducts = () => {
  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-light rounded-lg">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Product Management
            </h1>
            <p className="text-neutral-500 mt-1">
              Manage your product catalog and inventory
            </p>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        <NewArrivalProducts />
      </div>
    </div>
  );
};

export default AdminProducts;
