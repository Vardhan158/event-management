// src/pages/Admin/Payments.jsx
import React from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Payments = ({ payments }) => (
  <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
    <h2 className="text-3xl font-bold text-indigo-600 mb-6">Payments</h2>
    <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table className="min-w-full text-left">
        <thead className="bg-indigo-100 text-indigo-700">
          <tr>
            <th className="p-3">Event</th>
            <th className="p-3">User</th>
            <th className="p-3">Status</th>
            <th className="p-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{p.event?.title || "N/A"}</td>
              <td className="p-3">{p.user?.name || "N/A"}</td>
              <td className="p-3 capitalize">{p.paymentStatus}</td>
              <td className="p-3">₹{p.event?.price || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default Payments;
