// src/Pages/Home.jsx
import React from "react";
import NavBar from "../Components/NavBar";
import Hero from "../Components/Hero";
import ServiceGallery from "./ServiceGallery";
import Overview from "../Components/Overview";
import Footer from "../Components/Footer";

const Home = () => {
  return (
    <div>
      <NavBar />
      <Hero />
      <ServiceGallery />
      <Overview />
      <Footer />
    </div>
  );
};

export default Home;
