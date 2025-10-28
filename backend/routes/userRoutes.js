const express = require("express");
const router = express.Router();
const { authenticate } = require("../middlewares/authMiddleware");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");
const User = require("../models/User");

// Multer setup (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Upload profile image to Cloudinary
router.post("/upload-avatar", authenticate, upload.single("avatar"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No image provided" });

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "profile_pics" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    const result = await streamUpload(file.buffer);

    // ✅ Save avatar URL to MongoDB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true }
    );

    res.json({ imageUrl: result.secure_url, message: "Avatar updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading image" });
  }
});

// ✅ Get logged-in user's profile
router.get("/me", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("name email avatar");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
