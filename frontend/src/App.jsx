import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLogin from "./Pages/CustomerLogin";
import Home from "./Pages/Home";
import Overview from "./Components/Overview";
import BookingConfirmation from "./Pages/BookingConfirmation";
import Booking from "./Pages/Booking";
import CustomerDashboard from "./Pages/CustomerDashboard";
import ServicesPage from "./Pages/ServicesPage";
import EventDetails from "./Pages/EventDetails"; // ✅ new import

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/booking/:slug" element={<Booking />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/service-page" element={<ServicesPage />} />
        <Route path="/event/:slug" element={<EventDetails />} /> {/* ✅ new route */}
      </Routes>
  );
}

export default App;
