const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log("ℹ️ Admin already exists:", existingAdmin.email);
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    const admin = await User.create({
      name: "Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("🎉 Admin created successfully!");
    console.log("👉 Email:", admin.email);
    console.log("👉 Password:", ADMIN_PASSWORD);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
