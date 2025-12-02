import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Package,
  Frame,
  BarChart3,
  Loader2,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import axiosInstance from "../utils/axiosInstance";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const defaultStats = {
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
};

const AdminPanel = () => {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get("/dashboard/stats");
      const normalizedData = {
        ...defaultStats,
        ...response.data,
        breakdown: {
          ...defaultStats.breakdown,
          ...(response.data?.breakdown || {}),
        },
      };
      setStats(normalizedData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Failed to fetch dashboard stats:", err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const formatNumber = (value, isCurrency = false) => {
    const number = Number(value || 0);
    return isCurrency
      ? `₹${number.toLocaleString("en-IN")}`
      : number.toLocaleString("en-IN");
  };

  const statCards = [
    {
      icon: ShoppingBag,
      label: "Total Orders",
      value: formatNumber(stats.totalOrders),
      accent: "bg-blue-50 text-blue-600",
      link: "/adminorderPage",
      linkLabel: "View orders",
    },
    {
      icon: Package,
      label: "Total Products",
      value: formatNumber(stats.totalProducts),
      accent: "bg-emerald-50 text-emerald-600",
      link: "/adminproducts",
      linkLabel: "Manage products",
    },
    {
      icon: Frame,
      label: "Total Frames",
      value: formatNumber(stats.totalFrames),
      accent: "bg-purple-50 text-purple-600",
      link: "/framecustomizeadmin",
      linkLabel: "View frames",
    },
    {
      icon: BarChart3,
      label: "Revenue",
      value: formatNumber(stats.totalRevenue, true),
      accent: "bg-indigo-50 text-indigo-600",
      link: "/monthlyrevenue",
      linkLabel: "View revenue",
    },
  ];

  const ordersBreakdownData = useMemo(
    () => ({
      labels: ["Common", "Frame", "New Arrivals", "Special Offers"],
      datasets: [
        {
          label: "Orders",
          data: [
            stats.breakdown.commonOrders,
            stats.breakdown.frameOrders,
            stats.breakdown.newArrivals,
            stats.breakdown.specialOffers,
          ],
          backgroundColor: [
            "rgba(59, 130, 246, 0.8)",
            "rgba(139, 92, 246, 0.8)",
            "rgba(16, 185, 129, 0.8)",
            "rgba(249, 115, 22, 0.8)",
          ],
          borderRadius: 8,
          barThickness: 42,
        },
      ],
    }),
    [stats.breakdown]
  );

  const revenueBreakdownData = useMemo(
    () => ({
      labels: ["Common Revenue", "Frame Revenue"],
      datasets: [
        {
          data: [stats.breakdown.commonRevenue, stats.breakdown.frameRevenue],
          backgroundColor: ["#6366F1", "#22C55E"],
          borderWidth: 0,
        },
      ],
    }),
    [stats.breakdown]
  );

  const ordersChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${context.parsed.y}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#94a3b8", font: { size: 12 } },
        },
        y: {
          beginAtZero: true,
          grid: { color: "#f1f5f9" },
          ticks: { color: "#94a3b8", font: { size: 12 } },
        },
      },
    }),
    []
  );

  const revenueChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
      },
      cutout: "72%",
    }),
    []
  );

  const breakdownHighlights = [
    {
      label: "Common Orders",
      value: formatNumber(stats.breakdown.commonOrders),
      subtext: "Acrylic, canvas & backlight",
    },
    {
      label: "Frame Orders",
      value: formatNumber(stats.breakdown.frameOrders),
      subtext: "Custom frames sold",
    },
    {
      label: "New Arrivals Sold",
      value: formatNumber(stats.breakdown.newArrivals),
      subtext: "Latest collection traction",
    },
    {
      label: "Special Offers",
      value: formatNumber(stats.breakdown.specialOffers),
      subtext: "Promo conversions",
    },
  ];

  const revenueShare = (value) => {
    const total =
      Number(stats.breakdown.commonRevenue || 0) +
      Number(stats.breakdown.frameRevenue || 0);
    if (!total) return "0%";
    return `${Math.round((Number(value || 0) / total) * 100)}%`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-indigo-600 font-semibold">
            Admin overview
          </p>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm">
            Monitor orders, inventory, frames, and revenue in one glance.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated at {lastUpdated}
            </span>
          )}
          <button
            type="button"
            onClick={fetchDashboardStats}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-200 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {loading ? "Refreshing" : "Refresh data"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.label}
                  </p>
                  <div className="mt-3 min-h-[40px] text-3xl font-semibold text-gray-900">
                    {loading ? (
                      <div className="flex items-center gap-2 text-base text-gray-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading
                      </div>
                    ) : (
                      card.value
                    )}
                  </div>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent}`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <Link
                to={card.link}
                className="mt-6 inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                {card.linkLabel}
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Orders analytics
              </h2>
              <p className="text-sm text-gray-500">
                Category-wise order distribution
              </p>
            </div>
          </div>
          <div className="mt-6 min-h-[320px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Bar data={ordersBreakdownData} options={ordersChartOptions} />
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Revenue analytics
            </h2>
            <p className="text-sm text-gray-500">
              Compare common vs frame revenue
            </p>
          </div>
          <div className="mt-6 h-[260px]">
            {loading ? (
              <div className="flex h-full items-center justify-center text-gray-400">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Doughnut
                data={revenueBreakdownData}
                options={revenueChartOptions}
              />
            )}
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Common Revenue</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(stats.breakdown.commonRevenue, true)}
                </p>
              </div>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                {revenueShare(stats.breakdown.commonRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Frame Revenue</p>
                <p className="text-lg font-semibold text-gray-900">
                  {formatNumber(stats.breakdown.frameRevenue, true)}
                </p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                {revenueShare(stats.breakdown.frameRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Quick insights
            </h3>
            <p className="text-sm text-gray-500">
              Snapshot of how key funnels are performing
            </p>
          </div>
          <Link
            to="/adminorderPage"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
          >
            View orders
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {breakdownHighlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-gray-900">
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                ) : (
                  item.value
                )}
              </p>
              <p className="mt-1 text-xs text-gray-500">{item.subtext}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
