const mongoose = require("mongoose");

// Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // ✅ must be attached after authentication
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true, // ✅ prevents null event errors
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true, // ✅ must be passed from frontend
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    guests: {
      type: Number,
      default: 1,
      min: 1,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "rejected", "cancelled", "booked"], // ✅ all lowercase
      default: "pending",
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
