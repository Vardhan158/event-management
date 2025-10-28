const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Review = require("../models/Review");
const User = require("../models/User"); // ✅ to list all users
const { sendEmail } = require("../utils/sendEmail");

// 📊 Dashboard Overview
exports.getDashboard = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const upcomingEvents = await Event.find({ date: { $gte: new Date() } });
    const completedEvents = await Event.find({ date: { $lt: new Date() } });
    const pendingBookings = await Booking.find({ status: "pending" });
    const reviews = await Review.find();

    res.json({
      totalBookings,
      totalEvents: upcomingEvents.length + completedEvents.length,
      upcomingEvents,
      completedEvents,
      pendingBookings,
      reviews,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Confirm Booking
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event", "title");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "confirmed";
    await booking.save();

    await sendEmail(
      booking.email,
      "Booking Confirmed",
      `Your booking for "${booking.event?.title}" has been confirmed.`
    );

    res.json({ message: "Booking confirmed", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ❌ Reject Booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event", "title");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    await sendEmail(
      booking.email,
      "Booking Rejected",
      `Unfortunately, your booking for "${booking.event?.title}" was rejected.`
    );

    res.json({ message: "Booking rejected", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// 👥 Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// 🎟️ Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

// 📅 Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "title date price")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

// 💰 Get All Payments (if your booking includes payment info)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Booking.find({ paymentStatus: { $exists: true } })
      .populate("event", "title price")
      .populate("user", "name email");
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch payments", error: err.message });
  }
};

// 🗓️ Add Event
exports.addEvent = async (req, res) => {
  try {
    console.log("📩 Incoming event data:", req.body);
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ message: "Event added successfully", event });
  } catch (err) {
    console.error("❌ Add Event Error:", err.message);
    res.status(500).json({ message: "Failed to add event", error: err.message });
  }
};

// ✏️ Update Event
exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully", updatedEvent });
  } catch (err) {
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
};

// ❌ Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
};
