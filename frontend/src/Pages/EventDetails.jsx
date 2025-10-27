import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";

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
  "corporate-events": Corporate,
  graduation: Graduation,
  "theme-parties": Theme,
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

const EventDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
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

  // ✅ Fetch event by slug from backend
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/slug/${slug}`);
        if (res.data) {
          const data = res.data;
          setEvent({
            _id: data._id,
            title: data.title,
            price: data.price,
            location: data.location,
            date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
            img: serviceImages[data.slug] || null,
            description: data.description || "",
          });
        }
      } catch (err) {
        toast.error("Event not found!");
      }
    };
    fetchEvent();
  }, [slug]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Booking + Payment
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!event) {
      toast.error("Event not loaded!");
      return;
    }

    const token = localStorage.getItem("customer");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    setLoading(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Payment gateway not loaded!");
        return;
      }

      // Create order on backend
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
            toast.success("🎉 Booking confirmed!");
            setShowForm(false);
            setTimeout(() => navigate("/dashboard"), 2000);
          } catch (err) {
            toast.error("Booking failed!");
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
      console.error("Payment failed", err);
      toast.error("Payment failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!event)
    return (
      <div className="text-center text-gray-600 py-20 text-2xl">
        Loading event details...
      </div>
    );

  return (
    <>
      <Navbar />
      <ToastContainer position="top-center" autoClose={1500} />

      <section className="min-h-screen bg-gray-50 py-25 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Image */}
          <img
            src={event.img}
            alt={event.title}
            className="rounded-xl shadow-md w-full h-96 object-cover mb-6"
          />

          {/* Info */}
          <h1 className="text-4xl font-bold text-indigo-600 mb-3">
            {event.title}
          </h1>
          <p className="text-gray-700 mb-4 text-lg">{event.description}</p>
          <p className="text-indigo-500 mb-2 text-lg">
            📍 {event.location}
          </p>
          <p className="text-indigo-500 mb-2 text-lg">
            💰 ₹{event.price}
          </p>

          {/* Book Button */}
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-3 rounded-full shadow-md transition"
          >
            Book Now
          </button>
        </div>
      </section>

      {/* ✅ Floating Booking Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            {/* Close */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
              Book {event.title}
            </h2>

            {/* Event Info */}
            <div className="bg-gray-100 p-4 rounded-xl mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">
                Event Information
              </h3>
              <p>📍 Location: {event.location}</p>
              <p>💰 Price: ₹{event.price}</p>
              <p>📅 Date: {event.date}</p>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                value={form.phone}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="eventDate"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                value={form.eventDate}
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="guests"
                min="1"
                placeholder="No. of Guests"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                value={form.guests}
                onChange={handleChange}
                required
              />

              <textarea
                name="notes"
                placeholder="Additional Notes..."
                rows="4"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                value={form.notes}
                onChange={handleChange}
              ></textarea>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Processing..." : "Confirm Booking & Pay"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
