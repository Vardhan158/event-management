import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../Components/Navbar";

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [userReview, setUserReview] = useState(null); // ✅ store logged-in user's review
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
        setBooking(res.data);
      } catch (err) {
        console.error("Error fetching booking:", err);
      }
    };

    fetchBooking();
  }, [id, navigate]);

  // ✅ Fetch user's review for this event (if exists)
  useEffect(() => {
    const fetchUserReview = async () => {
      if (!booking?.event?._id) return;
      try {
        const token = localStorage.getItem("customer");
        const res = await axios.get(
          `http://localhost:5000/api/review/${booking.event._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // find the review by this logged-in user (backend returns all reviews for event)
        const userData = JSON.parse(atob(token.split(".")[1])); // decode JWT to get user id
        const foundReview = res.data.find(
          (r) => r.user?._id === userData.id
        );

        if (foundReview) setUserReview(foundReview);
      } catch (err) {
        console.error("Error fetching user review:", err);
      }
    };

    fetchUserReview();
  }, [booking]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return alert("Please select a star rating");

    try {
      setSubmitting(true);
      const token = localStorage.getItem("customer");

      const res = await axios.post(
        "http://localhost:5000/api/review",
        {
          eventId: booking.event?._id,
          rating,
          comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccessMsg("✅ Review added successfully!");
      setUserReview(res.data.review); // ✅ set user's review after posting
    } catch (error) {
      console.error("Error adding review:", error);
      alert("Failed to add review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking)
    return (
      <div>
        <Navbar />
        <p className="text-center mt-20 text-gray-600">Loading...</p>
      </div>
    );

  const location =
    booking.event?.location ||
    booking.event?.venue ||
    booking.venue ||
    "Not specified";

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
            <strong>Date:</strong> {formatDate(booking.eventDate)}
          </p>
          <p>
            <strong>Location:</strong> {location}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span
              className={`font-semibold ${
                booking.status === "completed"
                  ? "text-green-600"
                  : booking.status === "confirmed"
                  ? "text-blue-600"
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

        {/* ✅ Review Section */}
        {booking.status === "confirmed" && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              {userReview ? "Your Review" : "Add a Review"}
            </h2>

            {successMsg && (
              <p className="text-green-600 text-center mb-3">{successMsg}</p>
            )}

            {/* ✅ Show review if already submitted */}
            {userReview ? (
              <div className="bg-gray-50 p-5 rounded-lg shadow-inner text-center">
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-2xl ${
                        star <= userReview.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 italic">
                  "{userReview.comment || "No comment"}"
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {formatDate(userReview.createdAt)}
                </p>
              </div>
            ) : (
              /* ✅ Review Form */
              <form
                onSubmit={handleReviewSubmit}
                className="flex flex-col items-center space-y-4"
              >
                {/* ⭐ Star Rating */}
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-3xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* 💬 Comment */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  rows="4"
                ></textarea>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-2 rounded-lg text-white ${
                    submitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingDetails;
