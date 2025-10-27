const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const paymentController = require("../Controllers/paymentController");

router.post("/order", authenticate, paymentController.createOrder);
router.post("/verify", authenticate, paymentController.verifyPayment);

// ✅ New route: get payment status for a user's bookings
router.get("/status", authenticate, paymentController.getPaymentStatus);

module.exports = router;
