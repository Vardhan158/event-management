const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  price: { type: Number, default: 0 },
  image: { type: String }, // optional field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Event", eventSchema);
