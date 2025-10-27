import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CustomerLogin from "./Pages/CustomerLogin";
import Home from "./Pages/Home";
import Overview from "./Components/Overview";
import BookingConfirmation from "./Pages/BookingConfirmation";
import Booking from "./Pages/Booking";
import CustomerDashboard from "./Pages/CustomerDashboard";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/overview" element={<Overview />} />
        {/* ✅ Use slug instead of eventId */}
        <Route path="/booking/:slug" element={<Booking />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
      </Routes>
  );
}

export default App;
