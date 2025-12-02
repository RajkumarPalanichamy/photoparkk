import React, { useState } from "react";
import FrameOrders from "./FrameOrders";
import CommonOrder from "./CommonOrder";
import { Frame, Package } from "lucide-react";

const AdminOrderPage = () => {
  const [activeTab, setActiveTab] = useState("frame");

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <p className="text-gray-600 mt-2">
          Manage and track all customer orders
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("frame")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "frame"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Frame className="w-5 h-5" />
              <span>Frame Orders</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("common")}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === "common"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Package className="w-5 h-5" />
              <span>Acrylic, Canvas, Backlight Orders</span>
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "frame" ? <FrameOrders /> : <CommonOrder />}
      </div>
    </div>
  );
};

export default AdminOrderPage;
