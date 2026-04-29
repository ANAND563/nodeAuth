const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../services/emailService');

const SECRET_KEY = "mysecretkey";

exports.register = async (req, res) => {
    const { name, username, email, mobile, address, city, state, zip, country, status, password } = req.body;
    const image = req.file ? req.file.filename : null;

    const checkSql = "SELECT * FROM otp_verifications WHERE email = ? AND is_verified = true";
    db.query(checkSql, [email], async (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(403).json({ message: "Please verify your email first" });
        }

        const emailCheckSql = "SELECT id FROM users WHERE email = ?";
        db.query(emailCheckSql, [email], async (err, emailResult) => {
            if (err) return res.status(500).json(err);

            if (emailResult.length > 0) {
                return res.status(409).json({ message: "Email already registered. Please use a different email." });
            }

            const usernameCheckSql = "SELECT id FROM users WHERE username = ?";
            db.query(usernameCheckSql, [username], async (err, usernameResult) => {
                if (err) return res.status(500).json(err);

                if (usernameResult.length > 0) {
                    return res.status(409).json({ message: "Username already taken. Please choose a different username." });
                }

                const hashedPassword = await bcrypt.hash(password, 10);

                const sql = "INSERT INTO users (name, username, email, mobile, address, city, state, zip, country, image, status, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

                db.query(sql, [name, username, email, mobile, address, city, state, zip, country, image, status, hashedPassword], (err, result) => {
                    if (err) return res.status(500).json(err);

                    res.json({ message: "User registered successfully" });
                });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], async (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = result[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, {
            expiresIn: '1h'
        });

        res.json({ token });
    });
};

exports.sendOtp = async (req, res) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const deleteSql = "DELETE FROM otp_verifications WHERE email = ?";
    db.query(deleteSql, [email], async (err) => {
        if (err) return res.status(500).json(err);

        const insertSql = "INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)";
        db.query(insertSql, [email, otp, expiresAt], async (err) => {
            if (err) return res.status(500).json(err);

            try {
                await sendOtpEmail(email, otp);
                console.log(`[DEV] OTP for ${email}: ${otp}`);
                res.json({ message: "OTP sent to your email" });
            } catch (emailErr) {
                console.error("[EMAIL ERROR]", emailErr.message);
                // Email fail hone pe bhi OTP console mein dikhe — testing ke liye
                console.log(`[DEV] OTP for ${email}: ${otp}`);
                res.status(500).json({ message: "Failed to send email. Check server console for OTP (dev only)." });
            }
        });
    });
};

exports.verifyOtp = (req, res) => {
    const { email, otp } = req.body;

    const sql = "SELECT * FROM otp_verifications WHERE email = ? AND otp = ?";
    db.query(sql, [email, otp], (err, result) => {
        if (err) return res.status(500).json(err);

        if (result.length === 0) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        const record = result[0];

        if (new Date() > new Date(record.expires_at)) {
            return res.status(400).json({ message: "OTP expired" });
        }

        const updateSql = "UPDATE otp_verifications SET is_verified = true WHERE email = ?";
        db.query(updateSql, [email], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: "Email verified successfully" });
        });
    });
};

exports.getUsers = (req, res) => {
    const sql = "SELECT id, name, username, email, mobile, address, city, state, zip, country, image, status, created_at FROM users";

    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);

        res.json({
            total: result.length,
            users: result
        });
    });
};
