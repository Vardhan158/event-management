import React, { useState } from "react";
import axios from "axios";
import BookingBG from "../assets/backgroundhome.jpg";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CustomerLogin.css";
import { useNavigate } from "react-router-dom";

const CustomerLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/signup";

    const payload = isLogin
      ? { email: form.email, password: form.password }
      : { name: form.name, email: form.email, password: form.password };

    try {
      const response = await axios.post(url, payload);

      if (isLogin) {
        const token = response.data.token;
        localStorage.setItem("userToken", token);

        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        toast.success("Login successful!");

        // ✅ Role-based redirect
        setTimeout(() => {
          if (decoded.role === "admin") {
            localStorage.setItem("admin", token);
            navigate("/adminDashboard");
          } else {
            localStorage.setItem("customer", token);
            navigate("/dashboard");
          }
        }, 1500);
      } else {
        toast.success("Registration successful! You can now login.");
        setIsLogin(true);
      }

      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error("❌ Login/Register Error:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{ backgroundImage: `url(${BookingBG})` }}
    >
      <div className="login-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="login-btn">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          onClick={() => setIsLogin(!isLogin)}
          className="toggle-login cursor-pointer mt-2"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default CustomerLogin;
