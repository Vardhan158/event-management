const Event = require("../models/Event");
const slugify = require("slugify");

// ✅ Create Event (with image upload + slug support)
exports.createEvent = async (req, res) => {
  try {
    console.log("📩 Incoming event data:", req.body);
    console.log("📷 Uploaded file info:", req.file);

    const { title, category, description, location, date, price } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    // ✅ Cloudinary image URL (from upload middleware)
    const imageUrl = req.file?.path || null;

    // ✅ Auto-generate unique slug
    const slug = slugify(title, { lower: true, strict: true });

    // ✅ Create event
    const event = await Event.create({
      title,
      category,
      description,
      location,
      date,
      price,
      image: imageUrl,
      slug,
      createdBy: req.user?.id || null, // optional: if user info exists
    });

    res.status(201).json({
      success: true,
      message: "🎉 Event created successfully!",
      event,
    });
  } catch (err) {
    console.error("❌ Add event error:", err);
    if (err.code === 11000 && err.keyPattern?.slug) {
      return res.status(400).json({
        success: false,
        message: "Event with this slug already exists. Try renaming the title.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Server error while creating event.",
      error: err.message,
    });
  }
};

// ✅ Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    if (!events || events.length === 0) {
      return res.status(200).json([]); // ✅ Always return an array
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Get event by slug (for frontend URLs)
exports.getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Update event (with optional new image)
exports.updateEvent = async (req, res) => {
  try {
    const { title } = req.body;

    const updateData = { ...req.body };

    // ✅ Handle new image upload
    if (req.file && req.file.path) {
      updateData.image = req.file.path;
    }

    // ✅ Update slug if title changes
    if (title) {
      updateData.slug = slugify(title, { lower: true, strict: true });
    }

    const event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ success: true, message: "Event updated", event });
  } catch (err) {
    console.error("❌ Update event error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
