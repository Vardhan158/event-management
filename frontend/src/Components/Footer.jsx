import React from "react";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <footer className="bg-gradient-to-br from-pink-50 to-purple-100 text-gray-800 pt-16 pb-10 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Brand Section */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-2">
            Eventza
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Turning every event into a lifetime memory ✨
          </p>

          {/* Newsletter */}
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl py-6 px-5 mb-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-5">
              Subscribe to our newsletter for the latest event ideas and trends!
            </p>
            <form className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <button
                type="submit"
                className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-300 my-6"></div>

          {/* Footer Links */}
          <div className="flex flex-wrap justify-center gap-6 mb-4">
            <a href="#" className="hover:text-pink-600 transition">
              About Us
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              Services
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-pink-600 transition">
              Contact Us
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-500">
            © 2025 <span className="font-semibold text-indigo-700">Eventza</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
