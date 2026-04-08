const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

function sendEmail(email, subject, body) {
  const response = transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: email,
    subject,
    text: body,
  });

  return response;
}

module.exports = sendEmail;
