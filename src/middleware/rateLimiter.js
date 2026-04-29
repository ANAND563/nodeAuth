const rateLimit = require('express-rate-limit');

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                  // 100 requests per 15 min
    message: {
        message: "Too many requests from this IP, please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5,                    // sirf 5 baar OTP bhej sakte ho
    message: {
        message: "Too many OTP requests. Please wait 10 minutes before trying again."
    },
    standardHeaders: true,
    legacyHeaders: false
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
        message: "Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { generalLimiter, otpLimiter, loginLimiter };
