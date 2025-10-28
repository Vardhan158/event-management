import React from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Celebration from "../assets/Background.webp"; // 🎉 Replace with your actual hero image

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] mt-[70px] flex items-center justify-center overflow-hidden">
        <motion.img
          src={Celebration}
          alt="Celebration"
          className="absolute w-full h-full object-cover brightness-75"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
        <motion.div
          className="relative z-10 text-center text-white"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            About Our Celebration Platform
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
            Crafting unforgettable moments with seamless event booking and
            personalized experiences.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold text-indigo-600 mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            We believe every moment deserves celebration. Our mission is to
            simplify the event booking process — whether it’s a wedding,
            birthday, corporate party, or outdoor adventure — with transparency,
            creativity, and care. From concept to celebration, we bring your
            vision to life.
          </p>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 md:px-20 bg-gradient-to-br from-indigo-50 to-purple-100">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold text-indigo-600 mb-12">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Creativity",
                desc: "We infuse every event with innovation and fresh ideas to make it truly special.",
                icon: "🎨",
              },
              {
                title: "Reliability",
                desc: "We value your trust and ensure every detail is handled with professionalism.",
                icon: "🤝",
              },
              {
                title: "Joy",
                desc: "We exist to spread happiness — one event, one celebration at a time.",
                icon: "🎉",
              },
            ].map((val, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition-transform transform hover:-translate-y-2"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-5xl mb-4">{val.icon}</div>
                <h3 className="text-2xl font-semibold text-indigo-500 mb-2">
                  {val.title}
                </h3>
                <p className="text-gray-600">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 md:px-20 bg-white">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold text-indigo-600 mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { name: "Harsha", role: "Founder & CEO" },
              { name: "Meghana", role: "Creative Director" },
              { name: "Ramith-kulal", role: "Event Manager" },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                className="rounded-xl overflow-hidden shadow-lg bg-gray-50 hover:shadow-2xl transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="bg-indigo-100 h-48 flex items-center justify-center text-6xl font-bold text-indigo-500">
                  {member.name.charAt(0)}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Call to Action */}
      <motion.section
        className="py-20 bg-gradient-to-r from-indigo-600 to-purple-500 text-white text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold mb-4">
          Ready to Celebrate Your Next Big Moment?
        </h2>
        <p className="text-lg mb-8">
          Join thousands of happy customers who’ve turned their dreams into
          unforgettable celebrations.
        </p>
        <button
          onClick={() => (window.location.href = "/service-page")}
          className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-indigo-100 transition-all"
        >
          Explore Events
        </button>
      </motion.section>
    </div>
  );
};

export default About;
