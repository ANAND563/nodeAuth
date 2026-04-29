const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

const sendOtpEmail = async (toEmail, otp) => {
    const mailOptions = {
        from: `"NodeAuth" <${process.env.GMAIL_USER}>`,
        to: toEmail,
        subject: 'Your OTP Verification Code',
        html: `
            <h2>Email Verification</h2>
            <p>Your OTP is: <strong>${otp}</strong></p>
            <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
