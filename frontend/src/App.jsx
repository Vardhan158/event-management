import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Import all pages
import CustomerLogin from "./Pages/CustomerLogin";
import Home from "./Pages/Home";
import Overview from "./Components/Overview";
import BookingConfirmation from "./Pages/BookingConfirmation";
import CustomerDashboard from "./Pages/CustomerDashboard";
import ServicesPage from "./Pages/ServicesPage";
import EventDetails from "./Pages/EventDetails";
import BookingDetails from "./Pages/BookingDetails";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import AdminDashboard from "./Pages/Admin/AdminDashboard"; // ✅ add this line

function App() {
  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<CustomerLogin />} />

      {/* ✅ Info Pages */}
      <Route path="/overview" element={<Overview />} />
      <Route path="/service-page" element={<ServicesPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />

      {/* ✅ Event / Booking */}
        <Route path="/event/:slug" element={<EventDetails />} />
        {/* <Route path="/booking/:slug" element={<Booking />} /> */}
      <Route path="/confirmation" element={<BookingConfirmation />} />
      <Route path="/booking-details/:id" element={<BookingDetails />} />

      {/* ✅ Customer Dashboard */}
      <Route path="/dashboard" element={<CustomerDashboard />} />

      {/* ✅ Admin Dashboard */}
      <Route path="/adminDashboard" element={<AdminDashboard />} />  {/* <-- added route */}
    </Routes>
  );
}

export default App;
