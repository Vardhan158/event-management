import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  anniversary: Anniversary,
  weddings: Wedding,
  "corporate-events": Corporate,
  "theme-parties": Theme,
  "baby-showers": BabyShower,
  graduation: Graduation,
  "birthday-party": Birthday,
  camping: Camping,
};

const EventDetails = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [reviews, setReviews] = useState([]);

  // ✅ Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/slug/${slug}`);
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

  // ✅ Fetch reviews for the event
  useEffect(() => {
    if (!event?._id) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/review/${event._id}`);
        console.log("Review response:", res.data);

        // 👇 FIXED LINE
        setReviews(res.data || []); // Backend sends an array directly
      } catch (err) {
        console.error("Error fetching reviews:", err);
        toast.error("Failed to load reviews");
      }
    };

    fetchReviews();
  }, [event]);

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

      <section className="min-h-screen bg-gray-50 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <img
            src={event.img}
            alt={event.title}
            className="rounded-xl shadow-md w-full h-96 object-cover mb-6"
          />

          <h1 className="text-4xl font-bold text-indigo-600 mb-3">{event.title}</h1>

          <p className="text-gray-700 mb-4 text-lg">{event.description}</p>
          <p className="text-indigo-500 mb-2 text-lg">📍 Location: {event.location}</p>
          <p className="text-indigo-500 mb-6 text-lg">💰 Price: ₹{event.price}</p>

          {/* ✅ Review Section */}
          <div className="mt-10 bg-white shadow-md rounded-2xl p-6">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-4">
              User Reviews
            </h2>

            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center">No reviews yet for this event.</p>
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
    </>
  );
};

export default EventDetails;
