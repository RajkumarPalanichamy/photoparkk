import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const { data } = await axiosInstance.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setUser(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

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
      // Always clear local storage and redirect
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="text-neutral-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">
              {user?.name}
            </h1>
            <p className="text-lg text-neutral-600 mb-4">{user?.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-error text-white py-2 px-4 rounded hover:bg-error-light"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
