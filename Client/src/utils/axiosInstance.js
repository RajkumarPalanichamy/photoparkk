// src/utils/axiosInstance.js
import axios from "axios";

// Resolve base URL from env with safe fallbacks
// Priority: explicit Vite env -> window env injection -> relative "/api"
const envBaseUrl =
  import.meta?.env?.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && window.__API_BASE_URL__) ||
  "/api";

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

    if (
      err.response?.status === 401 &&
      err.response.data.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        const res = await axios.post(`${envBaseUrl}/users/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        // Retry original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
