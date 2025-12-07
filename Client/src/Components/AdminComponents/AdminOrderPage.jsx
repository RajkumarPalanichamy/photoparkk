import React, { useState } from "react";
import FrameOrders from "./FrameOrders";
import CommonOrder from "./CommonOrder";
import { Frame, Package, ShoppingBag } from "lucide-react";

const AdminOrderPage = () => {
  const [activeTab, setActiveTab] = useState("frame");

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary-light rounded-lg">
            <ShoppingBag className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-secondary">
              Order Management
            </h1>
            <p className="text-neutral-500 mt-1">
          Manage and track all customer orders
        </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="flex flex-wrap text-sm font-medium text-center text-neutral-600 border-b border-neutral-200 mb-6">
        <li className="me-2">
          <button
            onClick={() => setActiveTab("frame")}
            className={`inline-block p-4 rounded-t-lg transition-colors ${
              activeTab === "frame"
                ? "text-primary bg-neutral-100"
                : "hover:text-secondary hover:bg-neutral-100"
            }`}
          >
            Frame Orders
          </button>
        </li>
        <li className="me-2">
          <button
            onClick={() => setActiveTab("common")}
            className={`inline-block p-4 rounded-t-lg transition-colors ${
              activeTab === "common"
                ? "text-primary bg-neutral-100"
                : "hover:text-secondary hover:bg-neutral-100"
            }`}
          >
            Product Orders
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div>{activeTab === "frame" ? <FrameOrders /> : <CommonOrder />}</div>
    </div>
  );
};

export default AdminOrderPage;
