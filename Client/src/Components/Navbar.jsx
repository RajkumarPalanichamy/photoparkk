import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "../context/CartContext";
import axiosInstance from "../utils/axiosInstance";

const StyledNavLink = ({ to, children, className }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
        isActive
          ? "text-gray-900 font-semibold"
          : "text-gray-600 hover:text-gray-900"
      } ${className || ""}`
    }
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
  </NavLink>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownVisible, setMobileDropdownVisible] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const navRef = useRef(null);
  const profileRef = useRef(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const loadAuthFromLocalStorage = () => {
      const token = localStorage.getItem("accessToken");
      const user = localStorage.getItem("user");

      if (!token || !user) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserName("");
        return;
      }

      try {
        const parsedUser = JSON.parse(user);
        setIsAuthenticated(true);
        setIsAdmin(parsedUser.role === "admin");
        setUserName(parsedUser.name || "");
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
        setIsAuthenticated(false);
        setIsAdmin(false);
        setUserName("");
      }
    };

    loadAuthFromLocalStorage();
    window.addEventListener("storage", loadAuthFromLocalStorage);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("storage", loadAuthFromLocalStorage);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      // Try to call backend logout (but don't block if it fails)
      if (refreshToken) {
        try {
          await axiosInstance.post("/users/logout", { refreshToken });
        } catch (err) {
          // Log error but continue with logout anyway
          console.log(
            "Backend logout failed (user may already be logged out):",
            err.message
          );
        }
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Always clear local storage and state
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUserName("");
      setProfileDropdown(false);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }
  };

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-gray-100"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0 group">
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent tracking-tight">
                PHOTO PARK
              </span>
              <span className="text-xs font-medium text-gray-500 tracking-wider uppercase mt-0.5">
                Since 1996
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <StyledNavLink to="/">Home</StyledNavLink>

            {/* Shop Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Shop
                <ChevronDown
                  size={14}
                  className="transition-transform group-hover:rotate-180"
                />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <NavLink
                    to="/shop/acrylic"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                  >
                    <div className="font-medium">Acrylic Prints</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Premium acrylic displays
                    </div>
                  </NavLink>
                  <NavLink
                    to="/shop/canvas"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                  >
                    <div className="font-medium">Canvas Prints</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Gallery-quality canvas
                    </div>
                  </NavLink>
                  <NavLink
                    to="/shop/backlight-frames"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 border-l-2 border-transparent hover:border-blue-500"
                  >
                    <div className="font-medium">Backlight Frames</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      Illuminated displays
                    </div>
                  </NavLink>
                </div>
              </div>
            </div>

            <StyledNavLink to="/frames">Frames</StyledNavLink>
            <StyledNavLink to="/about">About</StyledNavLink>
            <StyledNavLink to="/contact">Contact</StyledNavLink>
            {isAdmin && (
              <StyledNavLink
                to="/admin/adminpanel"
                className="text-purple-600 hover:text-purple-700"
              >
                Admin Panel
              </StyledNavLink>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* User Greeting */}
                <span className="hidden sm:block text-sm text-gray-600 font-medium max-w-[120px] truncate">
                  Hello, {userName}
                </span>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
                  >
                    <User
                      size={18}
                      className="text-gray-600 group-hover:text-gray-900"
                    />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            Welcome back!
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {userName}
                          </p>
                        </div>
                        <NavLink
                          to="/my-orders"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200"
                        >
                          My Orders
                        </NavLink>
                        {isAdmin && (
                          <NavLink
                            to="/admin/adminpanel"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200"
                          >
                            Admin Panel
                          </NavLink>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 mt-1"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <NavLink
                  to="/cart"
                  className="relative p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <ShoppingCart
                    size={18}
                    className="text-gray-600 group-hover:text-gray-900"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </>
            ) : (
              /* Login/Signup Button for logged-out users */
              <NavLink
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
              >
                Login / Sign Up
              </NavLink>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              <Menu size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              PHOTO PARK
            </span>
            <span className="text-xs text-gray-500">Since 1996</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
          >
            Home
          </NavLink>

          {/* Mobile Shop Dropdown */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => setMobileDropdownVisible(!mobileDropdownVisible)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
            >
              <span>Shop</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  mobileDropdownVisible ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileDropdownVisible && (
              <div className="pl-6 py-2 space-y-1">
                <NavLink
                  to="/shop/acrylic"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  Acrylic Prints
                </NavLink>
                <NavLink
                  to="/shop/canvas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  Canvas Prints
                </NavLink>
                <NavLink
                  to="/shop/backlight-frames"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  Backlight Frames
                </NavLink>
              </div>
            )}
          </div>

          {["Frames", "Customize", "About", "Contact"].map((item) => (
            <NavLink
              key={item}
              to={`/${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 font-medium"
            >
              {item}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/adminpanel"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-purple-600 hover:bg-purple-50 transition-all duration-200 font-medium"
            >
              Admin Panel
            </NavLink>
          )}

          {/* User Section in Mobile */}
          <div className="pt-4 mt-4 border-t border-gray-100">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-gray-500">
                  Signed in as{" "}
                  <span className="font-medium text-gray-900">{userName}</span>
                </div>
                <NavLink
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  My Orders
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center font-medium hover:shadow-lg transition-all duration-200"
              >
                Sign In
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
