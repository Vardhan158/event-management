const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RYx3p2TaCH508s",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "So29uDOGlBhXVhFc7DCUeRL5",
});

// ✅ Create Razorpay Order
exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Razorpay accepts amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(201).json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    res.status(500).json({
      success: false,
      message: "Payment order creation failed",
      error: error.message,
    });
  }
};

// ✅ Verify Razorpay Payment (signature verification)
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment verification data" });
    }

    // Generate expected signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "So29uDOGlBhXVhFc7DCUeRL5")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature, payment failed" });
    }

    // ✅ At this point payment is verified
    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error("❌ Payment verification failed:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying payment",
      error: error.message,
    });
  }
};

// ✅ Fetch Payment Status for Logged-in User
exports.getPaymentStatus = async (req, res) => {
  try {
    const userId = req.user.id; // from authenticate middleware

    const bookings = await Booking.find({ user: userId })
      .populate("event", "title price")
      .select("paymentStatus amount event");

    res.status(200).json({
      success: true,
      payments: bookings,
    });
  } catch (error) {
    console.error("❌ Error fetching payment status:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching payment status",
    });
  }
};
