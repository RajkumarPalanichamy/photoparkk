// src/utils/axiosInstance.js
import axios from "axios";

// Resolve base URL from env with safe fallbacks
// Priority: explicit Vite env -> window env injection -> relative "/api" for localhost -> production API URL
const getBaseUrl = () => {
  // Check for explicit Vite environment variable
  if (import.meta?.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Check for window injection (for build-time configuration)
  if (typeof window !== "undefined" && window.__API_BASE_URL__) {
    return window.__API_BASE_URL__;
  }

  // For localhost, use relative path
  if (
    typeof window !== "undefined" &&
    window.location.hostname === "localhost"
  ) {
    return "/api";
  }

  // For production, use production API URL
  return "https://api.photoparkk.com/api";
};

const envBaseUrl = getBaseUrl();

const axiosInstance = axios.create({
  baseURL: envBaseUrl,
});

// ✅ Add token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// 🔄 Handle token refresh if accessToken expires
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // Only handle 401 errors (unauthorized) and skip if already retried
    if (err.response?.status === 401 && !originalRequest._retry) {
      // Skip refresh for login/register/refresh-token endpoints to avoid infinite loops
      const isAuthEndpoint =
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/register") ||
        originalRequest.url?.includes("/refresh-token");

      if (isAuthEndpoint) {
        return Promise.reject(err);
      }

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // If no refresh token exists, redirect to login
      if (!refreshToken) {
        console.log("❌ No refresh token found, redirecting to login");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        window.location.href = "/login";
        return Promise.reject(err);
      }

      try {
        // Attempt to refresh the access token
        // Use plain axios here to avoid circular dependency and token injection
        const refreshResponse = await axios.post(
          `${envBaseUrl}/users/refresh-token`,
          {
            refreshToken,
          }
        );

        const newAccessToken = refreshResponse.data.accessToken;

        if (newAccessToken) {
          // Store new access token
          localStorage.setItem("accessToken", newAccessToken);

          // Update the original request with new token
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

          // Retry the original request
          return axiosInstance(originalRequest);
        } else {
          throw new Error("No access token received from refresh");
        }
      } catch (refreshErr) {
        console.error(
          "❌ Token refresh failed:",
          refreshErr.response?.data?.message || refreshErr.message
        );

        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        // Check if refresh token expired or is invalid
        const isRefreshTokenExpired =
          refreshErr.response?.status === 403 &&
          (refreshErr.response?.data?.message?.includes("expired") ||
            refreshErr.response?.data?.message?.includes(
              "Invalid refresh token"
            ));

        if (isRefreshTokenExpired) {
          console.log("🔄 Refresh token expired, redirecting to login");
        }

        // Redirect to login page
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    // For non-401 errors, just reject normally
    return Promise.reject(err);
  }
);

export default axiosInstance;
