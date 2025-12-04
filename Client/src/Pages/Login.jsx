import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Loader2, X } from "lucide-react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const toggleState = () => {
    setCurrentState(currentState === "Login" ? "Sign Up" : "Login");
    setError("");
    setSuccess("");
    setFormData({ name: "", email: "", password: "" });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password.trim();

    try {
      if (currentState === "Sign Up") {
        await axiosInstance.post("/users/register", {
          name,
          email,
          password,
        });
        setSuccess("Registered successfully! Please log in.");
        setTimeout(() => {
          setCurrentState("Login");
          setFormData({ name: "", email: "", password: "" });
        }, 1500);
      } else {
        const res = await axiosInstance.post("/users/login", {
          email,
          password,
        });

        if (res.data.accessToken) {
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("role", res.data.user.role);

          setSuccess("Logged in successfully!");

          // 👇 This will notify Navbar to update immediately
          window.dispatchEvent(new Event("storage"));

          setTimeout(() => {
            if (res.data.user.role === "admin") {
              navigate("/admin/adminpanel");
            } else {
              navigate("/");
            }
          }, 1000);
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {currentState === "Login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-white/90 text-sm">
              {currentState === "Login"
                ? "Sign in to continue to Photoparkk"
                : "Join us and start customizing your photos"}
            </p>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <form onSubmit={onSubmitHandler} className="space-y-5">
              {/* Name Field (only for Sign Up) */}
              {currentState === "Sign Up" && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={onChangeHandler}
                      className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      required
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={onChangeHandler}
                    className="w-full px-4 py-3 pl-11 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={onChangeHandler}
                    className="w-full px-4 py-3 pl-11 pr-11 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                    placeholder="Enter your password"
                    autoComplete={
                      currentState === "Login"
                        ? "current-password"
                        : "new-password"
                    }
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password (only for Login) - Hidden for now */}
              {/* {currentState === "Login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )} */}

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-in slide-in-from-left-2 duration-300">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-in slide-in-from-left-2 duration-300">
                  <p className="text-green-700 text-sm font-medium">
                    {success}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {currentState === "Login"
                      ? "Signing in..."
                      : "Creating account..."}
                  </>
                ) : currentState === "Login" ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Toggle between Login and Sign Up */}
            <div className="mt-6 text-center">
              <p className="text-gray-600 text-sm">
                {currentState === "Login"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  onClick={toggleState}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  {currentState === "Login" ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-sm mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Reset Password
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotPasswordEmail("");
                  setForgotPasswordError("");
                  setForgotPasswordSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setForgotPasswordError("");
                setForgotPasswordSuccess("");
                setForgotPasswordLoading(true);

                try {
                  const res = await axiosInstance.post(
                    "/users/forgot-password",
                    {
                      email: forgotPasswordEmail.trim(),
                    }
                  );

                  if (res.data.success) {
                    setForgotPasswordSuccess(
                      res.data.message ||
                        "Password reset link sent to your email!"
                    );

                    // In development, check console for reset token
                    console.log(
                      "✅ Password reset requested for:",
                      forgotPasswordEmail.trim()
                    );
                    console.log(
                      "📧 Check server console for reset token (development only)"
                    );
                  } else {
                    setForgotPasswordError(
                      res.data.message ||
                        "Something went wrong. Please try again."
                    );
                  }

                  setTimeout(() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setForgotPasswordSuccess("");
                  }, 4000);
                } catch (err) {
                  setForgotPasswordError(
                    err.response?.data?.message ||
                      "Something went wrong. Please try again."
                  );
                } finally {
                  setForgotPasswordLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {forgotPasswordError && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                  <p className="text-red-700 text-sm">{forgotPasswordError}</p>
                </div>
              )}

              {forgotPasswordSuccess && (
                <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                  <p className="text-green-700 text-sm">
                    {forgotPasswordSuccess}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail("");
                    setForgotPasswordError("");
                    setForgotPasswordSuccess("");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {forgotPasswordLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
