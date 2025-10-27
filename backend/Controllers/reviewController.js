const Review = require("../models/Review");

// Add review
exports.addReview = async (req, res) => {
  const { eventId, rating, comment } = req.body;
  if (!eventId || !rating) return res.status(400).json({ message: "Event and rating required" });

  try {
    const review = await Review.create({
      user: req.user.id,
      event: eventId,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get reviews for event
exports.getEventReviews = async (req, res) => {
  console.log(req.params.id);
  try {
    const reviews = await Review.find({ event: req.params.id }).populate("user", "name");
    console.log(req.params.id);
    
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
