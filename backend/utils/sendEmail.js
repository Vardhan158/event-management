const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail", // You can use 'Yahoo', 'Outlook', or SMTP config
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define mail options
    const mailOptions = {
      from: `"Event Booking" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent, // ✅ Send as HTML instead of plain text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

module.exports = sendEmail;
