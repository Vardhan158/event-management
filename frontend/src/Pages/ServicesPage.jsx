import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../Components/Navbar";

// ✅ Reliable fallback image (replaces broken via.placeholder)
const FallbackImage = "https://placehold.co/300x200?text=No+Image";

const ServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch events from backend
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");

      // Ensure response is an array
      if (Array.isArray(res.data)) {
        setServices(res.data);
      } else if (res.data?.events && Array.isArray(res.data.events)) {
        // In case backend sends { events: [...] }
        setServices(res.data.events);
      } else {
        console.warn("Unexpected data format:", res.data);
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      toast.error("Failed to load events");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-12">
            Our Services
          </h1>

          {/* ✅ Loader */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : services.length === 0 ? (
            <p className="text-center text-gray-600 text-lg">
              No events available right now.
            </p>
          ) : (
            // ✅ Event Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {services.map((service) => (
                <EventCard
                  key={service._id}
                  service={service}
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

// ✅ Event Card Component
const EventCard = ({ service, onBook }) => {
  const [hover, setHover] = useState(false);

  // ✅ Handle backend image URL
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
