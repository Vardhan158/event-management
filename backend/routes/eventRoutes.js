const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/adminMiddleware");
const eventController = require("../controllers/eventController");

// Event CRUD routes

// ✅ Create event (admin only)
router.post("/", authenticate, adminOnly, eventController.createEvent);

// ✅ Optional: Get event by slug (public) - placed before /:id to avoid conflicts
router.get("/slug/:slug", eventController.getEventBySlug);

// ✅ Get all events (public)
router.get("/:id", eventController.getAllEvents);

// ✅ Get event by ID (public)
router.get("/:id", eventController.getEventById);

// ✅ Update event (admin only)
router.put("/:id", authenticate, adminOnly, eventController.updateEvent);

// ✅ Delete event (admin only)
router.delete("/:id", authenticate, adminOnly, eventController.deleteEvent);

module.exports = router;
