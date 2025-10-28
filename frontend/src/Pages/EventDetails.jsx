import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { motion } from "framer-motion";
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
  anniversary: Anniversary,
  weddings: Wedding,
  "corporate-events": Corporate,
  "theme-parties": Theme,
  "baby-showers": BabyShower,
  graduation: Graduation,
  "birthday-party": Birthday,
  camping: Camping,
};

// ✅ Load Razorpay
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

  const [event, setEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBookingLoader, setShowBookingLoader] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    guests: 1,
    notes: "",
  });

  const [reviews, setReviews] = useState([]);

  // ✅ Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/events/slug/${slug}`
        );
        const data = res.data.event || res.data;

        const imgUrl = data.image
          ? data.image.startsWith("http")
            ? data.image
            : `http://localhost:5000/${data.image.replace(/\\/g, "/")}`
          : serviceImages[data.slug?.toLowerCase()] || Birthday;

        setEvent({
          _id: data._id,
          title: data.title || "Untitled Event",
          description: data.description || "No description available.",
          location: data.location || "Not specified",
          price: data.price || 0,
          date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
          img: imgUrl,
        });
      } catch (err) {
        console.error("Error fetching event:", err);
        toast.error("Event not found!");
      }
    };

    fetchEvent();
  }, [slug]);

  // ✅ Fetch reviews for event
  useEffect(() => {
    if (!event?._id) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/review/${event._id}`
        );
        setReviews(res.data || []);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load reviews");
      }
    };

    fetchReviews();
  }, [event]);

  // ✅ Handle form inputs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ Booking + Payment Integration
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!event) return toast.error("Event not loaded!");
    const token = localStorage.getItem("customer");
    if (!token) return toast.error("Please login first!");

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) return toast.error("Payment gateway failed to load!");

      const { data: order } = await axios.post(
        "http://localhost:5000/api/payment/order",
        { amount: event.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_test_RYx3p2TaCH508s",
        amount: order.amount,
        currency: "INR",
        name: "Event Booking",
        description: `Booking for ${event.title}`,
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              "http://localhost:5000/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setShowBookingLoader(true);

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
                  paymentStatus: "paid",
                  amountPaid: event.price,
                  paymentId: response.razorpay_payment_id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              toast.success("🎉 Booking confirmed & payment successful!");
              setShowForm(false);

              setTimeout(() => {
                setShowBookingLoader(false);
                navigate("/dashboard");
              }, 2500);
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            toast.error("Payment verification failed!");
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#6366F1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initiation failed:", err);
      toast.error("Something went wrong during payment!");
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

      {/* ✅ Event Info */}
      <section className="min-h-screen bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <img
            src={event.img}
            alt={event.title}
            className="rounded-xl shadow-md w-full h-96 object-cover mb-6"
          />

          <h1 className="text-4xl font-bold text-indigo-600 mb-3">
            {event.title}
          </h1>

          <p className="text-gray-700 mb-4 text-lg">{event.description}</p>
          <p className="text-indigo-500 mb-2 text-lg">📍 {event.location}</p>
          <p className="text-indigo-500 mb-2 text-lg">💰 ₹{event.price}</p>

          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-3 rounded-full shadow-md transition"
          >
            Book Now
          </button>

          {/* ✅ Reviews */}
          <div className="mt-10 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              User Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center">
                No reviews yet for this event.
              </p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-gray-200 pb-4 last:border-none"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-gray-800">
                        {review.user?.name || "Anonymous"}
                      </h3>
                      <p className="text-yellow-500 font-medium">
                        ⭐ {review.rating}/5
                      </p>
                    </div>
                    <p className="text-gray-700 mt-2">{review.comment}</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ✅ Booking Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-semibold text-center text-indigo-600 mb-6">
              Book {event.title}
            </h2>

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

      {/* 💳 Glassmorphic Animated Payment Loader */}
      {showBookingLoader && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-2xl bg-gradient-to-b from-indigo-800/40 to-purple-900/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Animated Card */}
          <motion.div
            className="relative w-64 h-40 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl shadow-2xl overflow-hidden"
            initial={{ rotateY: 0 }}
            animate={{ rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute top-6 left-6 text-white font-semibold text-lg tracking-wide">
              💳 Event Payment
            </div>
            <div className="absolute bottom-6 left-6 text-white text-sm tracking-widest">
              Processing Securely...
            </div>
          </motion.div>

          {/* Floating Coins */}
          <div className="relative mt-16 w-full flex justify-center">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-6 h-6 bg-yellow-400 rounded-full shadow-lg"
                initial={{ y: 0, opacity: 0 }}
                animate={{
                  y: [0, -150, 0],
                  opacity: [0, 1, 0],
                  x: [0, (i - 2) * 40, 0],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              ></motion.div>
            ))}
          </div>

          {/* Loading Text */}
          <motion.p
            className="mt-28 text-white text-2xl font-semibold tracking-wide drop-shadow-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Processing Your Payment Securely...
          </motion.p>
        </motion.div>
      )}
    </>
  );
};

export default EventDetails;
