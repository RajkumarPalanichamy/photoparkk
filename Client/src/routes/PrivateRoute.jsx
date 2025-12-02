import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userString = localStorage.getItem("user");

  // Check if user is logged in
  if (!accessToken || !userString) {
    return <Navigate to="/login" replace />;
  }

  // Safely parse user data
  try {
    const user = JSON.parse(userString);
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // If parsing fails, clear invalid data and redirect to login
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
