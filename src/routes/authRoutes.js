const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const authController = require('../controller/AuthController');
const authMiddleware = require('../middleware/authMiddleware');
const { generalLimiter, otpLimiter, loginLimiter } = require('../middleware/rateLimiter');
const { registerValidation, loginValidation, sendOtpValidation, verifyOtpValidation } = require('../middleware/validator');

router.post('/register', generalLimiter, upload.uploadProfileImage.single('image'), registerValidation, authController.register);
router.post('/login', loginLimiter, loginValidation, authController.login);
router.post('/send-otp', otpLimiter, sendOtpValidation, authController.sendOtp);
router.post('/verify-otp', generalLimiter, verifyOtpValidation, authController.verifyOtp);

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: "Protected route", user: req.user });
});

router.get('/users', authMiddleware, authController.getUsers);

module.exports = router;
