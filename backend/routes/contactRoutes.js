const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// POST /api/contact
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or "Outlook" / "Yahoo"
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email details
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `📩 New Contact Message from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}

        Message:
        ${message}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

module.exports = router;
