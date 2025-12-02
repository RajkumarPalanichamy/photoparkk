import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userString = localStorage.getItem("user");

  // Check if user is logged in
  if (!accessToken || !userString) {
    return <Navigate to="/login" replace />;
  }

  // Safely parse user data
  let user;
  try {
    user = JSON.parse(userString);
  } catch (error) {
    // If parsing fails, clear invalid data and redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  // Check if user exists and has admin role
  if (!user || user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
