import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

// Import images
import Birthday from "../assets/Cake.png";
import Anniversary from "../assets/Anniversary.png";
import BabyShower from "../assets/BabyShower.jpg";
import Camping from "../assets/Camping.jpg";
import Corporate from "../assets/Corporate.jpg";
import Graduation from "../assets/Graduation.jpg";
import Theme from "../assets/Theme.jpg";
import Wedding from "../assets/Wedding.jpg";

const ServicesPage = () => {
  const navigate = useNavigate();

  // Service data
  const services = [
    { title: "Anniversary", img: Anniversary, slug: "anniversary", rating: 5, price: 1500, offerPrice: 1200 },
    { title: "Weddings", img: Wedding, slug: "weddings", rating: 4, price: 5000, offerPrice: 4500 },
    { title: "Corporate Events", img: Corporate, slug: "corporate-events", rating: 4, price: 2500, offerPrice: 2100 },
    { title: "Theme Parties", img: Theme, slug: "theme-parties", rating: 5, price: 1800, offerPrice: 1600 },
    { title: "Baby Showers", img: BabyShower, slug: "baby-showers", rating: 4, price: 2000, offerPrice: 1700 },
    { title: "Graduation", img: Graduation, slug: "graduation", rating: 3, price: 1200, offerPrice: 1000 },
    { title: "Birthday Party", img: Birthday, slug: "birthday-party", rating: 5, price: 1500, offerPrice: 1300 },
    { title: "Camping", img: Camping, slug: "camping", rating: 4, price: 2200, offerPrice: 1900 },
  ];

  return (
    <>
      <Navbar />

      <section className="min-h-screen bg-gray-100 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-center text-indigo-600 mb-12">
            Our Services
          </h1>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <EventCard
                key={service.slug}
                service={service}
                onBook={() => navigate(`/event/${service.slug}`)} // ✅ navigate to event details
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// ✅ Reusable Event Card Component
const EventCard = ({ service, onBook }) => {
  const [count, setCount] = useState(0);

  return (
    <div className="border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-lg transition duration-300 overflow-hidden">
      {/* Image */}
      <div className="flex items-center justify-center bg-gray-50 relative cursor-pointer">
        <img
          src={service.img}
          alt={service.title}
          className="object-cover w-full h-48 transition-transform duration-300 hover:scale-105"
          onClick={onBook}
        />
      </div>

      {/* Info */}
      <div className="p-4 text-gray-600">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{service.title}</h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {Array(5)
            .fill("")
            .map((_, i) => (
              <svg
                key={i}
                width="16"
                height="16"
                viewBox="0 0 18 17"
                fill={service.rating > i ? "#615fff" : "rgba(97,95,255,0.35)"}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.049.927c.3-.921 1.603-.921 1.902 0l1.294 3.983a1 1 0 0 0 .951.69h4.188c.969 0 1.371 1.24.588 1.81l-3.388 2.46a1 1 0 0 0-.364 1.118l1.295 3.983c.299.921-.756 1.688-1.54 1.118L9.589 13.63a1 1 0 0 0-1.176 0l-3.389 2.46c-.783.57-1.838-.197-1.539-1.118L4.78 10.99a1 1 0 0 0-.363-1.118L1.028 7.41c-.783-.57-.38-1.81.588-1.81h4.188a1 1 0 0 0 .95-.69z" />
              </svg>
            ))}
          <p className="text-sm text-gray-500">({service.rating})</p>
        </div>

        {/* Price */}
        <p className="text-indigo-500 font-semibold mb-3">
          ₹{service.offerPrice}{" "}
          <span className="text-gray-400 line-through text-sm">₹{service.price}</span>
        </p>

        {/* Book Now button */}
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
