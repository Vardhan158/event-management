const Event = require("../models/Event");

// Create Event
exports.createEvent = async (req, res) => {
  const { title, category, description, location, date, price, image } = req.body;
  if (!title || !date) return res.status(400).json({ message: "Title and date are required" });

  try {
    const event = await Event.create({
      title,
      category,
      description,
      location,
      date,
      price,
      image,
      createdBy: req.user.id,
    });
    res.status(201).json({ message: "Event created", event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ NEW: Get event by slug (for frontend URLs like /api/events/slug/weddings)
exports.getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated", event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
