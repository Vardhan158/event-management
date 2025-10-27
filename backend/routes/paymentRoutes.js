const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const paymentController = require("../Controllers/paymentController");

// Create Razorpay order
router.post("/order", authenticate, paymentController.createOrder);

// Verify Razorpay payment
router.post("/verify", authenticate, paymentController.verifyPayment);

module.exports = router;
