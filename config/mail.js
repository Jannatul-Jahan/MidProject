const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "56006fe71191e9",
      pass: "157dd6223dbd25"
    }
  });

  module.exports = transporter;