// src/pages/Admin/Overview.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Counter = ({ target }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const increment = target / (duration / 30);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        start = target;
        clearInterval(interval);
      }
      setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(interval);
  }, [target]);
  return <span>{count}</span>;
};

const Overview = ({ stats }) => (
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
  >
    {[
      { title: "Users", value: stats.users, color: "from-pink-500 to-rose-400" },
      { title: "Events", value: stats.events, color: "from-blue-500 to-cyan-400" },
      { title: "Bookings", value: stats.bookings, color: "from-indigo-500 to-purple-400" },
      { title: "Payments", value: stats.payments, color: "from-green-500 to-emerald-400" },
    ].map((card, index) => (
      <motion.div
        key={index}
        className={`bg-gradient-to-r ${card.color} text-white p-8 rounded-2xl shadow-lg text-center transform hover:scale-105 transition-transform`}
        whileHover={{ y: -5 }}
      >
        <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
        <p className="text-4xl font-bold">
          <Counter target={card.value} />
        </p>
      </motion.div>
    ))}
  </motion.div>
);

export default Overview;
