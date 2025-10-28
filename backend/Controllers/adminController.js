const Booking = require("../models/Booking");
const Event = require("../models/Event");
const Review = require("../models/Review");
const User = require("../models/User");
const sendEmail  = require("../utils/sendEmail");

/* -------------------------------------------------------------------------- */
/* 🧭 ADMIN DASHBOARD OVERVIEW */
/* -------------------------------------------------------------------------- */
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
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ❌ DELETE USER */
/* -------------------------------------------------------------------------- */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Optionally: delete user's bookings or reviews if you want full cleanup
    await Booking.deleteMany({ user: id });
    await Review.deleteMany({ user: id });

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ BOOKING STATUS MANAGEMENT */
/* -------------------------------------------------------------------------- */

// Confirm Booking
exports.confirmBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event", "title date")
      .populate("user", "name email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // ✅ Directly mark as completed instead of just confirmed
    booking.status = "completed";
    await booking.save();

    // ✅ Send email notification
    if (booking.user?.email) {
      await sendEmail(
        booking.user.email,
        "✅ Event Completed",
        `Hi ${booking.user.name},\n\nYour booking for "${booking.event.title}" on ${new Date(
          booking.event.date
        ).toDateString()} has been marked as completed.\n\nThank you for choosing us!\n\n– Event Management Team`
      );
    }

    res.json({ message: "Booking marked as completed successfully", booking });
  } catch (err) {
    console.error("Confirm booking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reject Booking
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("event", "title date")
      .populate("user", "name email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected";
    await booking.save();

    if (booking.user?.email) {
      await sendEmail(
        booking.user.email,
        "❌ Booking Rejected",
        `Hi ${booking.user.name},\n\nWe regret to inform you that your booking for "${booking.event.title}" was rejected.\n\n– Event Management Team`
      );
    }

    res.json({ message: "Booking rejected successfully", booking });
  } catch (err) {
    console.error("Reject booking error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* ✅ UNIVERSAL UPDATE BOOKING STATUS (Dropdown Handling) */
/* -------------------------------------------------------------------------- */
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const booking = await Booking.findById(req.params.id)
      .populate("event", "title date")
      .populate("user", "name email");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    // 📨 Email Notification
    if (booking.user?.email) {
      let subject, message;
      switch (status) {
        case "confirmed":
          subject = "🎉 Booking Confirmed!";
          message = `Hi ${booking.user.name},\n\nYour booking for "${booking.event.title}" on ${new Date(
            booking.event.date
          ).toDateString()} has been confirmed.\n\nThank you for choosing us!\n\n– Event Management Team`;
          break;
        case "completed":
          subject = "✅ Event Completed";
          message = `Hi ${booking.user.name},\n\nWe hope you enjoyed your event "${booking.event.title}".\n\nThank you for trusting us!\n\n– Event Management Team`;
          break;
        case "pending":
          subject = "⏳ Booking Pending";
          message = `Hi ${booking.user.name},\n\nYour booking for "${booking.event.title}" is currently pending.\nWe'll notify you once it is confirmed.\n\n– Event Management Team`;
          break;
        case "rejected":
          subject = "❌ Booking Rejected";
          message = `Hi ${booking.user.name},\n\nWe regret to inform you that your booking for "${booking.event.title}" was rejected.\n\n– Event Management Team`;
          break;
        default:
          subject = "Booking Update";
          message = `Hi ${booking.user.name},\n\nYour booking status has been updated to "${status}".`;
      }

      await sendEmail(booking.user.email, subject, message);
    }

    res.json({ message: `Booking updated to '${status}' successfully`, booking });
  } catch (err) {
    console.error("Update booking error:", err);
    res.status(500).json({
      message: "Failed to update booking status",
      error: err.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/* 👥 USER MANAGEMENT */
/* -------------------------------------------------------------------------- */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    res.json(users);
  } catch (err) {
    console.error("Get users error:", err);
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🎟️ EVENT MANAGEMENT */
/* -------------------------------------------------------------------------- */
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ message: "Failed to fetch events", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 📅 BOOKINGS & PAYMENTS */
/* -------------------------------------------------------------------------- */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("event", "title date price")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Get bookings error:", err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Booking.find({ paymentStatus: { $exists: true } })
      .populate("event", "title price")
      .populate("user", "name email");
    res.json(payments);
  } catch (err) {
    console.error("Get payments error:", err);
    res.status(500).json({ message: "Failed to fetch payments", error: err.message });
  }
};

/* -------------------------------------------------------------------------- */
/* 🗓️ EVENT CRUD */
/* -------------------------------------------------------------------------- */
exports.addEvent = async (req, res) => {
  try {
    console.log("📩 Incoming event data:", req.body);
    console.log("📷 Uploaded file info:", req.file);

    const { title, description, price, location, date } = req.body;

    // Validate required fields
    if (!title || !description || !price || !location || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Cloudinary: use file path from Cloudinary upload
    const imageUrl = req.file ? req.file.path : null;

    const newEvent = new Event({
      title,
      description,
      price,
      location,
      date,
      image: imageUrl, // store Cloudinary URL
    });

    await newEvent.save();

    res.status(201).json({
      message: "🎉 Event added successfully",
      event: newEvent,
    });
  } catch (err) {
    console.error("❌ Add event error:", err);
    res.status(500).json({
      message: "Failed to add event",
      error: err.message,
    });
  }
};


exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully", updatedEvent });
  } catch (err) {
    console.error("Update event error:", err);
    res.status(500).json({ message: "Failed to update event", error: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    res.status(500).json({ message: "Failed to delete event", error: err.message });
  }
};
