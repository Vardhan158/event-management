const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const adminController = require("../Controllers/adminController");

// 🔐 Admin Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return res.json({ token, user: { email, role: "admin" } });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
});

// 🧭 Dashboard Overview
router.get("/dashboard", authenticate, adminOnly, adminController.getDashboard);

// 📦 Data Routes
router.get("/users", authenticate, adminOnly, adminController.getAllUsers);
router.get("/events", authenticate, adminOnly, adminController.getAllEvents);
router.get("/bookings", authenticate, adminOnly, adminController.getAllBookings);
router.get("/payments", authenticate, adminOnly, adminController.getAllPayments);

// ✅ Booking Confirmation / Rejection
router.put("/booking/:id/confirm", authenticate, adminOnly, adminController.confirmBooking);
router.put("/booking/:id/reject", authenticate, adminOnly, adminController.rejectBooking);

// 🗓️ Event Management (Add / Edit / Delete)
router.post("/events", authenticate, adminOnly, adminController.addEvent);       // ➕ Add Event
router.put("/events/:id", authenticate, adminOnly, adminController.updateEvent); // ✏️ Edit Event
router.delete("/events/:id", authenticate, adminOnly, adminController.deleteEvent); // ❌ Delete Event

module.exports = router;
