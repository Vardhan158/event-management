import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BookingBG from "../assets/backgroundhome.jpg";
import * as jwtDecode from "jwt-decode"; // ✅ simplified import

import Birthday from "../assets/Cake.png";
import Anniversary from "../assets/Anniversary.png";
import BabyShower from "../assets/BabyShower.jpg";
import Camping from "../assets/Camping.jpg";
import Corporate from "../assets/Corporate.jpg";
import Graduation from "../assets/Graduation.jpg";
import Theme from "../assets/Theme.jpg";
import Wedding from "../assets/Wedding.jpg";

const serviceImages = {
  "birthday-party": Birthday,
  anniversary: Anniversary,
  "baby-shower": BabyShower,
  camping: Camping,
  "corporate-event": Corporate,
  "graduation-party": Graduation,
  "theme-party": Theme,
  weddings: Wedding,
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Booking = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: 1,
    notes: "",
  });

  // ✅ Fetch event details by slug
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/slug/${slug}`);
        if (res.data) {
          const data = res.data;
          setEvent({
            _id: data._id,
            title: data.title,
            slug: data.slug,
            location: data.location,
            price: data.price,
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
            img: serviceImages[data.slug] || null,
          });
        }
      } catch (err) {
        console.error("⚠️ Could not fetch event details:", err);
        toast.error("Event not found!");
      }
    };
    fetchEvent();
  }, [slug]);

  // ✅ Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("customer");
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const res = await axios.get(`http://localhost:5000/api/users/${decoded.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setForm((prev) => ({
          ...prev,
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        }));
      } catch (err) {
        console.warn("⚠️ Failed to fetch user info", err);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Booking + payment logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) {
      toast.error("Event details not loaded!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("customer");
      if (!token) {
        toast.error("Please login first!");
        setLoading(false);
        return;
      }

      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error("Payment gateway not loaded.");
        setLoading(false);
        return;
      }

      // ✅ Create Razorpay order
      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/order",
        { amount: event.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_GycCn6vlLqKeUM",
        amount: order.amount,
        currency: "INR",
        name: "Event Booking",
        description: `Booking for ${event.title}`,
        order_id: order.id,
        handler: async () => {
          try {
            await axios.post(
              "http://localhost:5000/api/bookings",
              {
                eventId: event._id,
                name: form.name,
                email: form.email,
                phone: form.phone,
                eventDate: form.eventDate || event.date,
                guests: Number(form.guests),
                notes: form.notes,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success("🎉 Booking confirmed successfully!");
            setTimeout(() => navigate("/dashboard"), 2000);
          } catch (err) {
            console.error("❌ Booking failed:", err);
            toast.error("Booking creation failed!");
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#6366F1" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error("❌ Payment failed:", err);
      toast.error("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!event) {
    return (
      <div className="flex items-center justify-center h-screen text-white text-3xl">
        Loading event details...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{ backgroundImage: `url(${BookingBG})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-6xl p-10">
        <h1 className="text-5xl font-extrabold text-center text-white mb-10">
          Book Your <span className="text-indigo-400">{event.title}</span>
        </h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10 text-white">
          {/* Left Column */}
          <div className="space-y-6">
            {event.img && (
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-64 object-cover rounded-2xl shadow-md mb-4"
              />
            )}

            <div className="bg-white/20 p-6 rounded-2xl border border-white/30 shadow-md">
              <h2 className="text-3xl font-semibold text-indigo-300 mb-4">
                Event Information
              </h2>
              <p className="text-xl mb-2">💰 Booking Fee: ₹{event.price}</p>
              <p className="text-indigo-200 mb-2">📍 Location: {event.location}</p>
              <p className="text-indigo-200 mb-2">📅 Date: {event.date}</p>
            </div>

            <div className="bg-white/20 p-6 rounded-2xl border border-white/30 shadow-md">
              <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
                Additional Notes
              </h2>
              <textarea
                name="notes"
                placeholder="Write any special requests..."
                value={form.notes}
                onChange={handleChange}
                rows={6}
                className="w-full p-4 bg-white/10 rounded-xl border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {["name", "email", "phone", "eventDate", "guests"].map((field) => (
              <div key={field}>
                <label className="block mb-2 text-indigo-300">
                  {field === "guests"
                    ? "No. of Guests"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field === "email"
                      ? "email"
                      : field === "eventDate"
                      ? "date"
                      : field === "guests"
                      ? "number"
                      : "text"
                  }
                  name={field}
                  value={form[field]}
                  onChange={handleChange}
                  min={field === "guests" ? 1 : undefined}
                  required={field !== "phone"}
                  className="w-full p-4 bg-white/10 rounded-xl border border-white/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:scale-105 hover:shadow-xl transition-transform duration-200 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-center" autoClose={1500} />
    </div>
  );
};

export default Booking;
