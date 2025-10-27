const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

exports.adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};
