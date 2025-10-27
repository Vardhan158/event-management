const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const adminController = require("../Controllers/adminController");

// Single admin login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    return res.json({ token, user: { email, role: "admin" } });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }
});

// Dashboard
router.get("/dashboard", authenticate, adminOnly, adminController.getDashboard);

// Booking approve/reject
router.put("/booking/:id/confirm", authenticate, adminOnly, adminController.confirmBooking);
router.put("/booking/:id/reject", authenticate, adminOnly, adminController.rejectBooking);

module.exports = router;
