const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const adminController = require("../Controllers/adminController");
const upload = require("../middlewares/uploadMiddleware");

//
// 🔐 Admin Login
//
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Verify admin credentials
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    // ✅ Add an 'id' field for consistency with user tokens
    const token = jwt.sign(
      { id: "admin", email, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    return res.json({
      token,
      user: { id: "admin", email, role: "admin" },
    });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
});

//
// 🧭 Dashboard Overview
//
router.get("/dashboard", authenticate, adminOnly, adminController.getDashboard);

//
// 👥 User Management
//
router.get("/users", authenticate, adminOnly, adminController.getAllUsers);
router.delete("/users/:id", authenticate, adminOnly, adminController.deleteUser);

//
// 🎉 Event Management (Add / Edit / Delete)
//
router.get("/events", authenticate, adminOnly, adminController.getAllEvents);

router.post(
  "/events",
  authenticate,
  adminOnly,
  upload.single("image"), // ✅ handle single image upload
  adminController.addEvent
);

router.put(
  "/events/:id",
  authenticate,
  adminOnly,
  upload.single("image"), // ✅ allow optional image update
  adminController.updateEvent
);

router.delete(
  "/events/:id",
  authenticate,
  adminOnly,
  adminController.deleteEvent
);

//
// 📅 Booking Management
//
router.get("/bookings", authenticate, adminOnly, adminController.getAllBookings);

router.put(
  "/booking/:id/confirm",
  authenticate,
  adminOnly,
  adminController.confirmBooking
);

router.put(
  "/booking/:id/reject",
  authenticate,
  adminOnly,
  adminController.rejectBooking
);

//
// 💳 Payment Management
//
router.get("/payments", authenticate, adminOnly, adminController.getAllPayments);
router.put("/bookings/:id/status", authenticate, adminOnly, adminController.updateBookingStatus);
//
// ✅ Export Router
//
module.exports = router;
