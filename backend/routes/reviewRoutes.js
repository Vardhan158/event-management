const express = require("express");
const router = express.Router();
const { addReview , getEventReviews } = require("../Controllers/reviewController");
const { authenticate } = require("../middlewares/authMiddleware");

// User creates a review
router.post("/",authenticate,  addReview);

// Get all reviews (admin only)
router.get("/:id", getEventReviews);

// Get reviews by event ID (public or user)
// router.get("/event/:eventId", reviewController.getReviewsByEvent);

// // Delete a review (admin only)
// router.delete("/:id", authenticate, adminOnly, reviewController.deleteReview);

module.exports = router;
