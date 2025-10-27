const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const sendEmail = require("../utils/sendEmail");

// ==================
// Create a new booking (user)
// ==================
exports.createBooking = async (req, res) => {
  try {
    const { eventId, name, email, phone, eventDate, guests, notes, amountPaid } = req.body;

    // ✅ Fetch event details to use title and price in email
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const booking = new Booking({
      user: req.user.id,
      event: eventId,
      name,
      email,
      phone,
      eventDate,
      guests,
      notes,
      status: "booked",
      amountPaid: amountPaid || event.price || 0, // ✅ Default to event price if not passed
    });

    await booking.save();

    // ✅ Send confirmation email with event title and formatted price
    const message = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
        <h2 style="color: #4f46e5;">🎉 Booking Confirmed!</h2>
        <p>Dear <b>${name}</b>,</p>
        <p>Your booking for <b>${event.title}</b> on <b>${new Date(eventDate).toDateString()}</b> is confirmed.</p>
        <p><b>Guests:</b> ${guests}</p>
        <p><b>Amount Paid:</b> ₹${amountPaid || event.price}</p>
        <p>Thank you for booking with us!</p>
        <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">
        <p style="font-size:12px; color:#777;">This is an automated confirmation email. Please do not reply.</p>
      </div>
    `;

    await sendEmail(email, "Your Event Booking Confirmation", message);

    console.log("✅ Booking created & email sent:", booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Booking creation failed:", error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

// ==================
// Get all bookings for logged-in user
// ==================
exports.getMyBookings = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date location price img")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error in getMyBookings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================
// Get all bookings (admin only)
// ==================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("event", "title date location price img")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error in getAllBookings:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================
// Get single booking by ID (admin only)
// ==================
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("event", "title date location price img");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (err) {
    console.error("Error in getBookingById:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================
// Get event by slug (public)
// ==================
exports.getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug.toLowerCase() });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    console.error("Error in getEventBySlug:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================
// Update booking (admin OR user after payment)
// ==================
exports.updateBooking = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const { status, amountPaid, notes, eventDate, guests } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate("user", "name email")
      .populate("event", "title");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only admin or the same user can update
    if (req.user.role !== "admin" && !booking.user._id.equals(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: Not authorized" });
    }

    if (status) booking.status = status;
    if (amountPaid) booking.amountPaid = amountPaid;
    if (notes) booking.notes = notes;
    if (eventDate) booking.eventDate = new Date(eventDate);
    if (guests) booking.guests = Number(guests);

    await booking.save();

    // ✅ Send confirmation email if status is confirmed
    if (status && status.toLowerCase() === "confirmed") {
      const message = `Hi ${booking.user.name},\n\nYour booking for "${booking.event.title}" has been confirmed!\n\nThank you for choosing us.`;
      await sendEmail(
        booking.user.email,
        `Booking Confirmed: ${booking.event.title}`,
        message
      );
    }

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (err) {
    console.error("Error in updateBooking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================
// Delete booking (admin only)
// ==================
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error in deleteBooking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ==================
// Update booking (user-specific route for /my/:id)
// ==================
exports.updateMyBooking = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    const { notes, eventDate, guests } = req.body;

    if (notes) booking.notes = notes;
    if (eventDate) booking.eventDate = new Date(eventDate);
    if (guests) booking.guests = Number(guests);

    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (err) {
    console.error("Error in updateMyBooking:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
