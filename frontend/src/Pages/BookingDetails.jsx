import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("customer");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchBooking = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  if (!booking)
    return (
      <div>
        <Navbar />
        <p className="text-center mt-20 text-gray-600">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg mt-24 p-8">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">
          Booking Details
        </h1>
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Event Name:</strong> {booking.event?.title}
          </p>
          <p>
            <strong>Date:</strong> {booking.eventDate}
          </p>
          <p>
            <strong>Venue:</strong> {booking.venue || "Not specified"}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                booking.status === "completed"
                  ? "text-green-600"
                  : "text-yellow-600"
              }`}
            >
              {booking.status}
            </span>
          </p>
          <p>
            <strong>Payment Status:</strong>{" "}
            {booking.paymentStatus || "Pending"}
          </p>
          <p>
            <strong>Amount:</strong> ₹{booking.event?.price || 0}
          </p>
          <p>
            <strong>Customer Name:</strong> {booking.name}
          </p>
          <p>
            <strong>Email:</strong> {booking.email}
          </p>
          <p>
            <strong>Phone:</strong> {booking.phone}
          </p>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
