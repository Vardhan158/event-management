import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CustomerSignup.css";
import { useNavigate } from "react-router-dom";
import BookingBG from "../assets/backgroundhome.jpg";

const CustomerSignup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      toast.success("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 1500);
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      console.error("Signup error:", err);
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{ backgroundImage: `url(${BookingBG})` }}
    >
      <div className="signup-box">
        <h2>Customer Signup</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            type="email"
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

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default CustomerSignup;
