import React from "react";
import { Link } from "react-router-dom";
import Background from "../assets/Background.webp";

const Hero = () => {
  return (
    <section
      className="h-screen flex items-center justify-center text-center bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${Background})`,
      }}
    >
      {/* Overlay for soft blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl px-6 text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">
          Dream Maker
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-indigo-200 mb-3">
          Your Personal Dream Maker
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          We believe that it’s all about the{" "}
          <span className="font-semibold text-yellow-300">BIG DREAMS</span> and
          the{" "}
          <span className="font-semibold text-yellow-300">small details</span>!
          Let us make your events truly unforgettable.
        </p>

        {/* Login Button */}
        <Link
          to="/login"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg transition duration-300"
        >
          Login to Book
        </Link>
      </div>
    </section>
  );
};

export default Hero;
