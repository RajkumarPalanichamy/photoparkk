import User from "../models/users.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenUtils.js";

// In-memory refresh token store (for demo only)
let refreshTokens = [];

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Please fill all fields" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const allowedRoles = ["admin", "customer"];
    const assignedRole = allowedRoles.includes(role) ? role : "customer";

    const newUser = new User({ name, email, password, role: assignedRole });
    await newUser.save();

    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    refreshTokens.push(refreshToken);

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password)))
      return res.status(400).json({ message: "Invalid Credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  // Check if refresh token exists in our store
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Fetch user from database to get the role (refresh token only has id)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      // Remove invalid token from store
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new access token with user's current role
    const newAccessToken = generateAccessToken(user);

    res.json({
      accessToken: newAccessToken,
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("🔐 Refresh token verification failed:", error.message);

    // Remove invalid/expired token from store
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    if (error.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token expired" });
    }

    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const logout = (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      // Remove refresh token from store
      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    // Even if there's an error, return success to allow frontend to clear tokens
    res.status(200).json({ message: "Logged out successfully" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    console.error("Profile Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// Generate reset token
const getResetToken = () => {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return { resetToken, resetPasswordToken, resetPasswordExpire };
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if user exists for security - return same message
      return res.status(200).json({
        success: true,
        message:
          "If that email exists, a password reset link has been sent to your email.",
      });
    }

    // Generate reset token
    const { resetToken, resetPasswordToken, resetPasswordExpire } =
      getResetToken();

    // Save reset token to user
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpire = resetPasswordExpire;
    await user.save({ validateBeforeSave: false });

    // Use frontend URL for the reset link
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // In production, send email with reset token
    // In development, log it to console
    console.log("🔐 Password Reset Token:", resetToken);
    console.log("🔗 Reset URL:", resetUrl);
    console.log("📧 Email:", email);
    console.log("📧 In production, send this URL to user's email:", resetUrl);

    // Return success message without exposing the token
    res.status(200).json({
      success: true,
      message:
        "Password reset link has been sent to your email. Please check your inbox and follow the instructions to reset your password.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error.message);

    // Try to clear reset token if user exists
    try {
      const user = await User.findOne({ email });
      if (user) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
      }
    } catch (clearError) {
      console.error("Error clearing reset token:", clearError.message);
    }

    res.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { resetToken, password } = req.body;

  if (!resetToken || !password) {
    return res
      .status(400)
      .json({ message: "Reset token and password are required" });
  }

  try {
    // Hash the reset token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({
      message:
        "Password reset successfully. Please login with your new password.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
