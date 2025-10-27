const express = require("express");
const router = express.Router();
const bookingController = require("../Controllers/bookingController");
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");

// ==================
// User Routes
// ==================

// Create a new booking (user must be logged in)
router.post("/", authenticate, bookingController.createBooking);

// Get all bookings for the logged-in user
router.get("/my", authenticate, bookingController.getMyBookings);

// Get event by slug
router.get("/events/slug/:slug", bookingController.getEventBySlug);

// Update a booking (user can only update their own booking)
router.put("/bookings/my/:id", authenticate, bookingController.updateMyBooking);

// ==================
// Admin Routes
// ==================

// Get all bookings (admin only)
router.get("/bookings", authenticate, adminOnly, bookingController.getAllBookings);

// Get single booking by ID (admin only)
router.get("/bookings/:id", authenticate, adminOnly, bookingController.getBookingById);

// Update booking (admin only)
router.put("/bookings/:id", authenticate, adminOnly, bookingController.updateBooking);

// Delete booking (admin only)
router.delete("/bookings/:id", authenticate, adminOnly, bookingController.deleteBooking);

module.exports = router;
