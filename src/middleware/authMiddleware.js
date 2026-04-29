const jwt = require('jsonwebtoken');

const SECRET_KEY = "mysecretkey";

module.exports = (req, res, next) => {
    const token = req.header('authorization').split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
};