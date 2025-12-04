import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Frame,
  BarChart3,
  Menu,
  X,
  Home,
  LogOut,
  User,
} from "lucide-react";
import axiosInstance from "../utils/axiosInstance";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await axiosInstance.post("/users/logout", { refreshToken });
      }
    } catch (err) {
      console.log("Backend logout failed:", err.message);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/login");
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/admin/adminpanel",
    },
    {
      icon: ShoppingBag,
      label: "Orders",
      path: "/admin/orders",
    },
    {
      icon: Package,
      label: "Manage Products",
      path: "/admin/products",
    },
    {
      icon: Frame,
      label: "Manage Frames",
      path: "/admin/frames",
    },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="relative pt-[70px] h-screen">
      {/* Header */}
      <header className="flex shadow-md py-1 px-4 sm:px-7 bg-white min-h-[70px] tracking-wide z-[110] fixed top-0 w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 w-full relative">
          <Link to="/admin/adminpanel" className="flex items-center">
            <span className="text-2xl font-bold text-indigo-600">
              PhotoParkk
            </span>
            <span className="text-sm text-gray-500 ml-2">Admin</span>
          </Link>

          <div
            id="collapseMenu"
            className={`max-lg:hidden lg:!block max-lg:before:fixed max-lg:before:bg-black max-lg:before:opacity-50 max-lg:before:inset-0 max-lg:before:z-50 ${
              mobileMenuOpen ? "max-lg:block" : "max-lg:hidden"
            }`}
          >
            <button
              id="toggleClose"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed top-2 right-4 z-[100] rounded-full bg-white p-3"
            >
              <X className="w-5 h-5 fill-black" />
            </button>

            <div className="max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
              <div className="flex items-center max-lg:flex-col-reverse max-lg:ml-auto gap-8">
                <div className="flex items-center space-x-6 max-lg:flex-wrap">
                  <Link to="/" className="text-gray-700 hover:text-indigo-600">
                    <Home className="w-5 h-5" />
                  </Link>
                </div>

                <div className="dropdown-menu relative flex shrink-0 group">
                  {user?.name ? (
                    <div className="w-9 h-9 max-lg:w-16 max-lg:h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm max-lg:text-lg border-2 border-gray-300 cursor-pointer">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <User className="w-9 h-9 max-lg:w-16 max-lg:h-16 rounded-full border-2 border-gray-300 cursor-pointer text-gray-600" />
                  )}

                  <div className="dropdown-content hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute top-9 right-0 w-56 z-50">
                    <div className="w-full">
                      <Link
                        to="/profile"
                        className="text-[15px] text-slate-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out"
                      >
                        <User className="w-[18px] h-[18px] font-medium mr-3" />
                        Account
                      </Link>
                      <hr className="my-2 -mx-2 border-gray-200" />
                      <Link
                        to="/admin/adminpanel"
                        className="text-[15px] text-slate-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out"
                      >
                        <LayoutDashboard className="w-[18px] h-[18px] font-medium mr-3" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-[15px] text-slate-800 cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dropdown-item transition duration-300 ease-in-out"
                      >
                        <LogOut className="w-[18px] h-[18px] font-medium mr-3" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            id="toggleOpen"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden !ml-7 outline-0"
          >
            <Menu className="w-7 h-7" fill="#000" />
          </button>
        </div>
      </header>

      <div>
        <div className="flex items-start">
          {/* Sidebar */}
          <nav id="sidebar" className="lg:min-w-[280px] w-max max-lg:min-w-8">
            <div
              id="sidebar-collapse-menu"
              style={{ height: "calc(100vh - 72px)" }}
              className={`bg-white shadow-lg h-screen fixed py-6 px-4 top-[70px] left-0 overflow-auto z-[99] lg:min-w-[270px] lg:w-max max-lg:w-0 max-lg:invisible transition-all duration-500 ${
                sidebarOpen
                  ? "max-lg:w-1/2 max-lg:min-w-[300px] max-lg:visible"
                  : ""
              }`}
            >
              <ul className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`text-slate-800 text-[15px] font-medium flex items-center hover:bg-gray-100 rounded-md px-4 py-2 transition-all ${
                          active ? "bg-indigo-50 text-indigo-600" : ""
                        }`}
                      >
                        <Icon className="w-[18px] h-[18px] mr-3" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          <button
            id="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden w-8 h-8 z-[100] fixed top-[74px] left-[10px] cursor-pointer bg-indigo-600 flex items-center justify-center rounded-full outline-0 transition-all duration-500"
          >
            <Menu className="w-4 h-4 text-white" />
          </button>

          {/* Main Content */}
          <section className="main-content w-full overflow-auto p-6">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
