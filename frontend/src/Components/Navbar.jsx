import React, { useState } from "react";
import Logo from "../assets/Logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-gray-50/80 backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-200 h-[70px] flex items-center transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Eventza Logo"
            className="w-10 h-10 drop-shadow-md"
          />
          <span className="text-indigo-700 font-extrabold text-2xl tracking-wide">
            Eventza
          </span>
        </a>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-10 text-gray-700 font-medium text-lg">
          <a href="/" className="hover:text-indigo-600 transition duration-200">
            Home
          </a>
          <a href="/about" className="hover:text-indigo-600 transition duration-200">
            About
          </a>
          <a href="/events" className="hover:text-indigo-600 transition duration-200">
            Event Hub
          </a>
          <a href="/contact" className="hover:text-indigo-600 transition duration-200">
            Contact
          </a>
          <a href="/overview" className="hover:text-indigo-600 transition duration-200">
            Overview
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {menuOpen ? (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <nav className="md:hidden bg-gray-50/95 backdrop-blur-md text-gray-800 px-7 py-4 space-y-4 shadow-lg border-t border-gray-200 rounded-b-2xl transition-all">
          <a href="/" className="block hover:text-indigo-600 transition duration-200">
            Home
          </a>
          <a href="/about" className="block hover:text-indigo-600 transition duration-200">
            About
          </a>
          <a href="/events" className="block hover:text-indigo-600 transition duration-200">
            Event Hub
          </a>
          <a href="/contact" className="block hover:text-indigo-600 transition duration-200">
            Contact
          </a>
          <Link to={"/overview"} className="block hover:text-indigo-600 transition duration-200">
            Overview
          </Link>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
