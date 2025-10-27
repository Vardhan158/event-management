import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="bg-gray-50/80 backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center h-[70px]">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img src={Logo} alt="Eventza Logo" className="w-10 h-10 drop-shadow-md" />
          <span className="text-indigo-700 font-extrabold text-2xl tracking-wide">
            Eventza
          </span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-10 text-gray-700 font-medium text-lg">
          <Link to="/" className="hover:text-indigo-600 transition duration-200">
            Home
          </Link>
          <Link to="/about" className="hover:text-indigo-600 transition duration-200">
            About
          </Link>
          <Link to="/dashboard" className="hover:text-indigo-600 transition duration-200">
            Dashboard
          </Link>
          <Link to="/contact" className="hover:text-indigo-600 transition duration-200">
            Contact
          </Link>
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

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-gray-50/95 backdrop-blur-md shadow-lg border-t border-gray-200 overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-7 py-4 space-y-4 text-gray-800 font-medium">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600 transition duration-200"
          >
            About
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600 transition duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="hover:text-indigo-600 transition duration-200"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
