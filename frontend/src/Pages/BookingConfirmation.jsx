import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import ConfirmationBG from "../assets/backgroundhome.jpg";

const BookingConfirmation = () => {
  const { eventId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const res = await axios.get(
          `http://localhost:5000/api/bookings/user/${user._id}`
        );

        // Find the booking for the current event
        const eventBooking = res.data.find((b) => b.event === eventId);
        setBooking(eventBooking);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBooking();
  }, [eventId]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-2xl">
        Loading booking details...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-6"
      style={{ backgroundImage: `url(${ConfirmationBG})` }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl w-full max-w-4xl p-10 text-white text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-indigo-400 drop-shadow-lg">
          Booking Confirmed!
        </h1>
        <p className="text-xl mb-6">
          🎉 Thank you, <span className="font-semibold">{booking.name}</span>, your booking is successful.
        </p>

        <div className="bg-white/20 p-6 rounded-2xl border border-white/30 shadow-md text-left space-y-3">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-3">
            Booking Details
          </h2>
          <p>
            <span className="font-semibold">Event:</span> {booking.eventTitle || "Event Name"}
          </p>
          <p>
            <span className="font-semibold">Date:</span> {new Date(booking.eventDate).toLocaleDateString()}
          </p>
          <p>
            <span className="font-semibold">Guests:</span> {booking.guests}
          </p>
          <p>
            <span className="font-semibold">Amount Paid:</span> ₹{booking.amountPaid}
          </p>
          {booking.notes && (
            <p>
              <span className="font-semibold">Notes:</span> {booking.notes}
            </p>
          )}
        </div>

        <Link
          to="/dashboard"
          className="inline-block mt-8 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl font-semibold hover:scale-105 transition-transform duration-200"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmation;
