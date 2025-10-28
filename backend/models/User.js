const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    role: { 
      type: String, 
      enum: ["customer", "admin"], 
      default: "customer" 
    },

    // ✅ Add this field to store avatar URL
    avatar: {
      type: String,
      default: "https://res.cloudinary.com/demo/image/upload/v1690000000/default-avatar.png"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
