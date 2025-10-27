const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

/* ----------------------------- Helper Function ----------------------------- */
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "defaultsecret",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

/* ----------------------------- USER SIGNUP -------------------------------- */
exports.signup = async (req, res) => {
  console.log("🟢 Signup request received:", req.body);

  const { name, email, password, role } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "customer",
    });

    const token = generateToken(user);

    console.log("✅ New user created:", user.email);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ----------------------------- USER LOGIN -------------------------------- */
exports.login = async (req, res) => {
  console.log("🟠 Login request received:", req.body);

  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    console.log("✅ Login successful for:", user.email);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ----------------------------- ADMIN LOGIN -------------------------------- */
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("🟣 Admin login attempt:", email);

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD)
    return res.status(401).json({ message: "Invalid credentials" });

  try {
    let adminUser = await User.findOne({ email: ADMIN_EMAIL });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      adminUser = await User.create({
        name: "Admin",
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin created in DB:", adminUser.email);
    }

    const token = generateToken(adminUser);

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      user: {
        id: adminUser._id,
        email: adminUser.email,
        role: adminUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Admin login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/* ------------------------- GET USER PROFILE ------------------------------- */
exports.getUserProfile = async (req, res) => {
  try {
    const user = req.user; // from authMiddleware
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ name: user.name, email: user.email });
  } catch (error) {
    console.error("❌ Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
