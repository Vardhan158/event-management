import React from "react";
import Birthday from "../assets/Cake.png";
import Anniversary from "../assets/Anniversary.png";
import BabyShower from "../assets/BabyShower.jpg";
import Camping from "../assets/Camping.jpg";
import Corporate from "../assets/Corporate.jpg";
import Graduation from "../assets/Graduation.jpg";
import Theme from "../assets/Theme.jpg";
import Wedding from "../assets/Wedding.jpg";
import { useNavigate } from "react-router-dom";

export default function ServicesGallery() {
  const services = [
    { title: "Anniversary Celebrations", description: "Romantic & memorable events", img: Anniversary },
    { title: "Weddings", description: "Your dream day, perfectly planned", img: Wedding },
    { title: "Corporate Events", description: "Conferences, meetings, and team outings", img: Corporate },
    { title: "Theme Parties", description: "Fun, creative, and unforgettable", img: Theme },
    { title: "Baby Showers", description: "Cute & memorable celebrations", img: BabyShower },
    { title: "Graduation Parties", description: "Celebrate achievements with friends & family", img: Graduation },
    { title: "Birthday Party", description: "Celebrate milestones with style and fun", img: Birthday },
    { title: "Camping Trip", description: "Organize impactful outdoor events", img: Camping },
  ];

  const navigate = useNavigate();

  const handleServiceClick = (title) => {
    // Encode title to make it URL-safe
    const encodedTitle = encodeURIComponent(title);
    navigate(`/booking/${event_id}`);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
          Our Latest Services
        </h1>
        <div className="w-24 h-1 bg-indigo-600 mx-auto mb-6 rounded-full"></div>
        <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto tracking-wide">
          Discover our most recent events – crafted with care, style, and attention to detail.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-center">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="relative group w-full h-64 rounded-xl overflow-hidden shadow-lg cursor-pointer transition-all duration-500 hover:h-72"
            >
              <img
                src={service.img}
                alt={service.title}
                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-center px-4">
                <h3 className="text-xl md:text-2xl font-semibold text-white mb-1 drop-shadow-lg">
                  {service.title}
                </h3>
                <p className="text-gray-200 text-sm md:text-base">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
