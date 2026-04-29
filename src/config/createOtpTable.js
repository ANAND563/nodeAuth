const db = require('./database');

const createTable = `
CREATE TABLE IF NOT EXISTS otp_verifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at DATETIME NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
`;

db.query(createTable, (err, result) => {
    if (err) {
        console.log("OTP Table creation error", err);
    } else {
        console.log("OTP Verifications table ready");
    }
});
