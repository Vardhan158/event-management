// src/pages/Admin/Bookings.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Bookings = ({ bookings, fetchData }) => {
  const [loadingBookingId, setLoadingBookingId] = useState(null);

  const handleStatusChange = async (bookingId, newStatus) => {
    const token = localStorage.getItem("admin");
    if (!token) return toast.error("Unauthorized!");
    try {
      setLoadingBookingId(bookingId);
      await axios.put(
        `http://localhost:5000/api/admin/bookings/${bookingId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Booking ${newStatus}`);
      fetchData();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setLoadingBookingId(null);
    }
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Bookings</h2>
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="min-w-full text-left">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="p-3">Event</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{b.event?.title || "N/A"}</td>
                <td className="p-3">{b.user?.name || "N/A"}</td>
                <td className="p-3 capitalize">{b.status}</td>
                <td className="p-3">
                  <select
                    disabled={loadingBookingId === b._id}
                    value={b.status}
                    onChange={(e) =>
                      handleStatusChange(b._id, e.target.value)
                    }
                    className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Glassmorphic Fullscreen Loading Overlay */}
      {loadingBookingId && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center z-50 backdrop-blur-md bg-white/10 border-t border-white/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Spinner */}
          <div className="w-16 h-16 border-[5px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>

          {/* Text */}
          <p className="mt-6 text-indigo-100 text-lg font-semibold drop-shadow-md">
            Updating booking status...
          </p>

          {/* Subtle glowing ring */}
          <div className="absolute w-40 h-40 rounded-full bg-indigo-500/30 blur-3xl animate-pulse"></div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Bookings;
