import React from "react";
import Navbar from "./NavBar";

export default function Overview() {
  return (
    <><Navbar/>
    <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-100 text-gray-50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-700">
          Overview about Eventza !!!
        </h2>
        <h3 className="text-2xl md:text-3xl font-semibold mb-6 text-indigo-500">
          Let’s Plan Your Dream Event
        </h3>
        <p className="text-lg md:text-xl leading-relaxed text-gray-700">
          At <span className="font-semibold text-indigo-600">Dream Maker</span>,
          we believe events are not just dates on a calendar — they are the
          chapters that define our lives. We are not just event planners; we are
          storytellers, dreamers, and passionate creators who pour heart and
          soul into every celebration. From the elegance of weddings to the
          excitement of corporate events and theme parties, every detail is
          crafted to reflect <span className="font-semibold">your story</span>{" "}
          and <span className="font-semibold">your vision</span>.
        </p>
        <p className="text-lg md:text-xl leading-relaxed mt-6 text-gray-700">
          Our approach blends creativity with precision, transforming your dream
          into an extraordinary experience. Whether it’s a small gathering or a
          grand celebration, we make sure every moment feels magical — the kind
          that lives on in memories and stories for years to come.
        </p>
      </div>
    </section>
    </>
  );
}
