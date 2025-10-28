import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";

const FallbackImage = "https://placehold.co/300x200?text=No+Image";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({}); // ✅ Store average ratings by eventId

  // ✅ Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");

      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.events)
        ? res.data.events
        : [];

      setServices(data);
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch reviews for each event to calculate average rating
  const fetchRatings = async (events) => {
    try {
      const ratingMap = {};

      await Promise.all(
        events.map(async (event) => {
          try {
            const res = await axios.get(
              `http://localhost:5000/api/review/${event._id}`
            );
            const reviews = Array.isArray(res.data) ? res.data : [];

            const avgRating =
              reviews.length > 0
                ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
                : 0;

            ratingMap[event._id] = avgRating;
          } catch (err) {
            console.warn(`No reviews for event ${event._id}`);
            ratingMap[event._id] = 0;
          }
        })
      );

      setRatings(ratingMap);
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    const loadData = async () => {
      await fetchEvents();
    };
    loadData();
  }, []);

  // ✅ Fetch ratings when services are loaded
  useEffect(() => {
    if (services.length > 0) fetchRatings(services);
  }, [services]);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-12">
            Our Services
          </h1>

          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No events available right now.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {services.map((service) => (
                <EventCard
                  key={service._id}
                  service={service}
                  rating={ratings[service._id] || 0}
                  onBook={() =>
                    navigate(`/event/${service.slug || service._id}`)
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

// ✅ Star Rating Component
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        if (index < fullStars) return <span key={index} className="text-yellow-500">★</span>;
        else if (index === fullStars && halfStar)
          return <span key={index} className="text-yellow-400">☆</span>;
        else return <span key={index} className="text-gray-300">★</span>;
      })}
      <span className="ml-1 text-sm text-gray-500">
        ({rating.toFixed(1)})
      </span>
    </div>
  );
};

// ✅ Event Card Component
const EventCard = ({ service, rating, onBook }) => {
  const [hover, setHover] = useState(false);

  const imageUrl = service.image
    ? service.image.startsWith("http")
      ? service.image
      : `http://localhost:5000/${service.image.replace(/\\/g, "/")}`
    : FallbackImage;

  return (
    <div
      className={`border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition duration-300 overflow-hidden ${
        hover ? "scale-[1.02]" : ""
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex items-center justify-center bg-gray-50 relative cursor-pointer">
        <img
          src={imageUrl}
          alt={service.title || "Event"}
          className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
          onClick={onBook}
          onError={(e) => (e.target.src = FallbackImage)}
        />
      </div>

      <div className="p-4 text-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {service.title || "Untitled Event"}
        </h3>

        {/* ✅ Average Star Rating from backend */}
        <StarRating rating={rating} />

        <p className="text-sm text-gray-500 mb-2 line-clamp-2">
          {service.description || "No description available."}
        </p>

        <p className="text-indigo-500 font-semibold mb-3">
          ₹{service.price || 0}
        </p>

        <button
          onClick={onBook}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default ServicesPage;
