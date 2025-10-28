const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const eventController = require("../controllers/eventController");

// ✅ Create event (admin only)
router.post("/", authenticate, adminOnly, eventController.createEvent);

// ✅ Get all events (public)
router.get("/", eventController.getAllEvents);

// ✅ Get event by slug (optional public)
router.get("/slug/:slug", eventController.getEventBySlug);

// ✅ Get event by ID (public)
router.get("/:id", eventController.getEventById);

// ✅ Update event (admin only)
router.put("/:id", authenticate, adminOnly, eventController.updateEvent);

// ✅ Delete event (admin only)
router.delete("/:id", authenticate, adminOnly, eventController.deleteEvent);

module.exports = router;
