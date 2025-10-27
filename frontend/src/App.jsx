import React from "react";
import { Routes, Route } from "react-router-dom";

// ✅ Import all pages
import CustomerLogin from "./Pages/CustomerLogin";
import Home from "./Pages/Home";
import Overview from "./Components/Overview";
import BookingConfirmation from "./Pages/BookingConfirmation";
import Booking from "./Pages/Booking";
import CustomerDashboard from "./Pages/CustomerDashboard";
import ServicesPage from "./Pages/ServicesPage";
import EventDetails from "./Pages/EventDetails";
import BookingDetails from "./Pages/BookingDetails";

function App() {
  return (
    <Routes>
      {/* ✅ Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<CustomerLogin />} />

      {/* ✅ Info Pages */}
      <Route path="/overview" element={<Overview />} />
      <Route path="/service-page" element={<ServicesPage />} />

      {/* ✅ Event / Booking */}
      <Route path="/event/:slug" element={<EventDetails />} />
      <Route path="/booking/:slug" element={<Booking />} />
      <Route path="/confirmation" element={<BookingConfirmation />} />
      <Route path="/booking-details/:id" element={<BookingDetails />} />

      {/* ✅ Customer Dashboard */}
      <Route path="/dashboard" element={<CustomerDashboard />} />
    </Routes>
  );
}

export default App;
