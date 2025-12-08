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
          ? "text-secondary font-semibold"
          : "text-neutral-600 hover:text-secondary"
      } ${className || ""}`
    }
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-neutral-200"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex-shrink-0 group">
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-bold text-secondary tracking-tight">
                PHOTO PARKK
              </span>
              <span className="text-xs font-medium text-neutral-500 tracking-wider uppercase mt-0.5">
                Since 1996
              </span>
            </div>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <StyledNavLink to="/">Home</StyledNavLink>

            {/* Shop Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-600 hover:text-secondary transition-colors duration-200">
                Shop
                <ChevronDown
                  size={14}
                  className="transition-transform group-hover:rotate-180"
                />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-neutral-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="py-2">
                  <NavLink
                    to="/products"
                    className="block px-4 py-3 text-sm text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                  >
                    <div className="font-medium">All Products</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Browse our complete collection
                    </div>
                  </NavLink>
                  <NavLink
                    to="/shop/acrylic"
                    className="block px-4 py-3 text-sm text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                  >
                    <div className="font-medium">Acrylic Prints</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Premium acrylic displays
                    </div>
                  </NavLink>
                  <NavLink
                    to="/shop/canvas"
                    className="block px-4 py-3 text-sm text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                  >
                    <div className="font-medium">Canvas Prints</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      Gallery-quality canvas
                    </div>
                  </NavLink>
                  <NavLink
                    to="/shop/backlight-frames"
                    className="block px-4 py-3 text-sm text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200 border-l-2 border-transparent hover:border-primary"
                  >
                    <div className="font-medium">Backlight Frames</div>
                    <div className="text-xs text-neutral-500 mt-0.5">
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
                className="text-primary hover:text-primary-hover"
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
                <span className="hidden sm:block text-sm text-neutral-600 font-medium max-w-[120px] truncate">
                  Hello, {userName}
                </span>

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200 group"
                  >
                    <User
                      size={18}
                      className="text-neutral-600 group-hover:text-secondary"
                    />
                  </button>

                  {profileDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden">
                      <div className="p-2">
                        <div className="px-3 py-2 border-b border-neutral-200">
                          <p className="text-sm font-medium text-secondary">
                            Welcome back!
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {userName}
                          </p>
                        </div>
                        <NavLink
                          to="/my-orders"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center px-3 py-2 text-sm text-neutral-700 hover:bg-primary-light hover:text-primary rounded-lg transition-all duration-200"
                        >
                          My Orders
                        </NavLink>
                        {isAdmin && (
                          <NavLink
                            to="/admin/adminpanel"
                            onClick={() => setProfileDropdown(false)}
                            className="flex items-center px-3 py-2 text-sm text-primary hover:bg-primary-light rounded-lg transition-all duration-200"
                          >
                            Admin Panel
                          </NavLink>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-error hover:bg-error-light rounded-lg transition-all duration-200 mt-1"
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
                  className="relative p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200 group"
                >
                  <ShoppingCart
                    size={18}
                    className="text-neutral-600 group-hover:text-secondary"
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-primary text-white text-xs font-bold rounded-full shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </NavLink>
              </>
            ) : (
              /* Login/Signup Button for logged-out users */
              <NavLink
                to="/login"
                className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-sm"
              >
                Login / Sign Up
              </NavLink>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 transition-colors duration-200"
            >
              <Menu size={20} className="text-neutral-600" />
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
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-secondary">
              PHOTO PARKK
            </span>
            <span className="text-xs text-neutral-500">Since 1996</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-neutral-200 transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 space-y-2">
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-4 py-3 rounded-xl text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200 font-medium"
          >
            Home
          </NavLink>

          {/* Mobile Shop Dropdown */}
          <div className="border-b border-neutral-200">
            <button
              onClick={() => setMobileDropdownVisible(!mobileDropdownVisible)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200 font-medium"
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
                  to="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-neutral-600 hover:bg-primary-light hover:text-primary transition-all duration-200"
                >
                  All Products
                </NavLink>
                <NavLink
                  to="/shop/acrylic"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-neutral-600 hover:bg-primary-light hover:text-primary transition-all duration-200"
                >
                  Acrylic Prints
                </NavLink>
                <NavLink
                  to="/shop/canvas"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-neutral-600 hover:bg-primary-light hover:text-primary transition-all duration-200"
                >
                  Canvas Prints
                </NavLink>
                <NavLink
                  to="/shop/backlight-frames"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 rounded-lg text-neutral-600 hover:bg-primary-light hover:text-primary transition-all duration-200"
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
              className="block px-4 py-3 rounded-xl text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200 font-medium"
            >
              {item}
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/adminpanel"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-primary hover:bg-primary-light transition-all duration-200 font-medium"
            >
              Admin Panel
            </NavLink>
          )}

          {/* User Section in Mobile */}
          <div className="pt-4 mt-4 border-t border-neutral-200">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-neutral-500">
                  Signed in as{" "}
                  <span className="font-medium text-secondary">{userName}</span>
                </div>
                <NavLink
                  to="/my-orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-neutral-700 hover:bg-primary-light hover:text-primary transition-all duration-200"
                >
                  My Orders
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-xl text-error hover:bg-error-light transition-all duration-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl bg-primary text-white text-center font-medium hover:bg-primary-hover hover:shadow-lg transition-all duration-200"
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
