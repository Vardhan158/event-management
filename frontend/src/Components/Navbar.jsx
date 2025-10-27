import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/Logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change or resize
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 w-full z-50 shadow-sm border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-[70px]">
        {/* ✅ Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={Logo}
            alt="Eventza Logo"
            className="w-10 h-10 drop-shadow-md"
          />
          <span className="text-indigo-700 font-extrabold text-2xl tracking-wide">
            Eventza
          </span>
        </Link>

        {/* ✅ Desktop Menu */}
        <nav className="hidden md:flex space-x-10 text-gray-700 font-medium text-lg">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition duration-200 ${
                location.pathname === link.to
                  ? "text-indigo-600 font-semibold"
                  : "hover:text-indigo-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ✅ Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      <div
        className={`md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-7 py-4 space-y-4 text-gray-800 font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`transition duration-200 ${
                location.pathname === link.to
                  ? "text-indigo-600 font-semibold"
                  : "hover:text-indigo-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
