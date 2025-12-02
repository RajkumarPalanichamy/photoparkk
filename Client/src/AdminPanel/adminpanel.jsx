import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Package,
  Frame,
  BarChart3,
  Loader2,
  ArrowUpRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import axiosInstance from "../utils/axiosInstance";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
);

const numberFormatter = new Intl.NumberFormat("en-IN");
const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalFrames: 0,
    totalRevenue: 0,
    breakdown: {
      commonOrders: 0,
      frameOrders: 0,
      newArrivals: 0,
      specialOffers: 0,
      commonRevenue: 0,
      frameRevenue: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/dashboard/stats");
      const payload = response.data || {};
      setStats({
        totalOrders: payload.totalOrders || 0,
        totalProducts: payload.totalProducts || 0,
        totalFrames: payload.totalFrames || 0,
        totalRevenue: payload.totalRevenue || 0,
        breakdown: {
          commonOrders: payload.breakdown?.commonOrders || 0,
          frameOrders: payload.breakdown?.frameOrders || 0,
          newArrivals: payload.breakdown?.newArrivals || 0,
          specialOffers: payload.breakdown?.specialOffers || 0,
          commonRevenue: payload.breakdown?.commonRevenue || 0,
          frameRevenue: payload.breakdown?.frameRevenue || 0,
        },
      });
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const breakdown = stats.breakdown;

  const statCards = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: loading ? "..." : numberFormatter.format(stats.totalOrders),
      color: "bg-blue-500",
      link: "/admin/orders",
      description: `Common ${breakdown.commonOrders} · Frames ${breakdown.frameOrders}`,
      ctaLabel: "View orders",
    },
    {
      icon: Package,
      label: "Total Products",
      value: loading ? "..." : numberFormatter.format(stats.totalProducts),
      color: "bg-green-500",
      link: "/admin/products",
      description: `New arrivals ${breakdown.newArrivals}`,
      ctaLabel: "Manage catalog",
    },
    {
      icon: Frame,
      label: "Total Frames",
      value: loading ? "..." : numberFormatter.format(stats.totalFrames),
      color: "bg-purple-500",
      link: "/admin/frames",
      description: `Frame orders ${breakdown.frameOrders}`,
      ctaLabel: "Customize frames",
    },
    {
      icon: BarChart3,
      label: "Revenue",
      value: loading ? "..." : currencyFormatter.format(stats.totalRevenue),
      color: "bg-indigo-500",
      link: "/admin/revenue",
      description: `Frames ${currencyFormatter.format(breakdown.frameRevenue)} · Common ${currencyFormatter.format(
        breakdown.commonRevenue,
      )}`,
      ctaLabel: "View revenue",
    },
  ];

  const orderBreakdownData = {
    labels: ["Common Orders", "Frame Orders", "New Arrivals", "Special Offers"],
    datasets: [
      {
        label: "Orders",
        data: [
          breakdown.commonOrders || 0,
          breakdown.frameOrders || 0,
          breakdown.newArrivals || 0,
          breakdown.specialOffers || 0,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(251, 191, 36, 0.7)",
        ],
        borderRadius: 8,
      },
    ],
  };

  const orderChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.formattedValue} orders`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  const revenueBreakdownData = {
    labels: ["Frame Revenue", "Common Revenue"],
    datasets: [
      {
        label: "Revenue",
        data: [breakdown.frameRevenue || 0, breakdown.commonRevenue || 0],
        backgroundColor: ["rgba(129, 140, 248, 0.8)", "rgba(34, 197, 94, 0.8)"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (context) =>
            `${context.label}: ${currencyFormatter.format(context.parsed)}`,
        },
      },
    },
  };

  const insightList = [
    {
      label: "Special offers live",
      value: breakdown.specialOffers,
      detail: "orders tagged as offers",
    },
    {
      label: "New arrival traction",
      value: breakdown.newArrivals,
      detail: "recent catalog orders",
    },
    {
      label: "Frames contribution",
      value: `${Math.round(
        stats.totalRevenue
          ? (breakdown.frameRevenue / Math.max(stats.totalRevenue, 1)) * 100
          : 0,
      )}%`,
      detail: "of total revenue",
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commerce Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track live sales, frames, and product performance at a glance.
          </p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">
              Synced {lastUpdated.toLocaleString("en-IN")}
            </p>
          )}
        </div>
        <button
          onClick={fetchDashboardStats}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-400" />
              Refreshing
            </>
          ) : (
            "Refresh data"
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <div className="text-3xl font-semibold text-gray-900">
                    {loading ? (
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-2xl text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <span>Quick action</span>
                <Link
                  to={stat.link}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  {stat.ctaLabel}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Order flow</h2>
              <p className="text-sm text-gray-500">
                Category-wise distribution across the latest cycle.
              </p>
            </div>
            <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
              Live
            </span>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Bar data={orderBreakdownData} options={orderChartOptions} />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Revenue mix</h2>
            <p className="text-sm text-gray-500">
              Compare common vs. frame revenue split.
            </p>
          </div>
          <div className="h-72">
            {loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Doughnut data={revenueBreakdownData} options={doughnutOptions} />
            )}
          </div>
          <div className="mt-6 space-y-4 border-t border-gray-100 pt-4">
            {insightList.map((item) => (
              <div key={item.label}>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  {item.label}
                </p>
                <p className="text-lg font-semibold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
