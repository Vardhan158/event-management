import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import axios from "axios";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // 🔹 You can integrate this with backend API later (like /api/contact)
      await axios.post("http://localhost:5000/api/contact", formData);
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError("Failed to send message. Please try again later.",err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="text-center py-24 mt-[70px] bg-gradient-to-r from-indigo-600 to-purple-500 text-white"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h1 className="text-5xl font-extrabold mb-4">Contact Us</h1>
        <p className="text-lg max-w-2xl mx-auto">
          We’d love to hear from you! Whether it’s a query, feedback, or
          collaboration idea — reach out and let’s make something great.
        </p>
      </motion.section>

      {/* Contact Info Section */}
      <section className="py-16 px-6 md:px-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          {[
            {
              icon: "📞",
              title: "Phone",
              value: "+91 0123456789",
            },
            {
              icon: "📧",
              title: "Email",
              value: "event@celebrationhub.com",
            },
            {
              icon: "📍",
              title: "Address",
              value: "Bangalore, Karnataka, India",
            },
          ].map((info, idx) => (
            <motion.div
              key={idx}
              className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-5xl mb-3">{info.icon}</div>
              <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                {info.title}
              </h3>
              <p className="text-gray-600">{info.value}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Contact Form */}
      <motion.section
        className="py-16 px-6 md:px-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-indigo-600 text-center mb-8">
            Send Us a Message
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-gray-50 p-8 rounded-2xl shadow-lg"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Message
              </label>
              <textarea
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-all"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {success && (
              <p className="text-green-600 text-center font-medium mt-2">
                ✅ Message sent successfully!
              </p>
            )}
            {error && (
              <p className="text-red-600 text-center font-medium mt-2">
                {error}
              </p>
            )}
          </form>
        </div>
      </motion.section>

      {/* Map Section (optional) */}
      <motion.section
        className="py-16 px-6 md:px-20 bg-gray-100 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-indigo-600 mb-6">
          Visit Our Office
        </h2>
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg">
          {/* Replace this iframe with your own Google Maps embed */}
          <iframe
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.892128817949!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670b8b4f4ed%3A0x401e4d9c1ab0!2sBangalore!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="400"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
