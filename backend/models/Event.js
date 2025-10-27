const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true }, // ✅ Added slug field
  // category: { type: String },
  description: { type: String },
  location: { type: String },
  date: { type: Date },
  price: { type: Number, default: 0 },
  image: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
