const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

// Initialize Razorpay instance
const instance = new Razorpay({
  key_id: "rzp_test_GycCn6vlLqKeUM",
  key_secret: "O9Cl2bu5DRx7i5rAswbZSoIm",
});

// Create Razorpay order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ message: "Amount is required" });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);
    res.status(201).json(order);
  } catch (err) {
    console.error("Razorpay order creation failed:", err);
    res.status(500).json({ message: "Payment order creation failed", error: err.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amount } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update booking as paid
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          status: "Confirmed",
          amountPaid: amount,
        });
      }
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Payment verification failed: Invalid signature" });
    }
  } catch (err) {
    console.error("Payment verification error:", err);
    res.status(500).json({ message: "Server error during payment verification" });
  }
};
