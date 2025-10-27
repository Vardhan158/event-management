const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Review = require("../models/Review");
const { sendEmail } = require("../utils/sendEmail");

exports.getDashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } });
    const completedEvents = await Event.find({ date: { $lt: new Date() } });
    const pendingBookings = await Booking.find({ status: "pending" });
    const reviews = await Review.find();

    res.json({ totalBookings, upcomingEvents, completedEvents, pendingBookings, reviews });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "confirmed";
    await booking.save();

    await sendEmail(booking.email, "Booking Confirmed", `Your booking for ${booking.event} is confirmed.`);

    res.json({ message: "Booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    await sendEmail(booking.email, "Booking Rejected", `Your booking for ${booking.event} was rejected.`);

    res.json({ message: "Booking rejected", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
