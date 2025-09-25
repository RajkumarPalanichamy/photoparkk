import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

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
        setCurrentState("Login");
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
              navigate("/adminpanel");
            } else {
              navigate("/"); // or "/profile" or "/"
            }
          }, 1000);
        }
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Try again.";
      setError(msg);
    }
  };
  

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onChangeHandler}
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Enter Your Name"
          autoComplete="off"
          required
        />
      )}
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={onChangeHandler}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter Your Email"
        autoComplete="off"
        required
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={onChangeHandler}
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Enter Your Password"
        autoComplete="off"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Password?</p>
        {currentState === "Login" ? (
          <p
            className="cursor-pointer font-medium"
            onClick={() => setCurrentState("Sign Up")}
          >
            Create account
          </p>
        ) : (
          <p
            className="cursor-pointer font-medium"
            onClick={() => setCurrentState("Login")}
          >
            Login Here
          </p>
        )}
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}

      <button
        type="submit"
        className="bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer"
      >
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

export default Login;
