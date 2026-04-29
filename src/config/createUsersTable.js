const db = require('./database');

const createTable = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    username VARCHAR(50),
    address VARCHAR(255),
    city VARCHAR(50),
    state VARCHAR(50),
    zip VARCHAR(10),
    country VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(255),
    mobile VARCHAR(10),
    image VARCHAR(100), 
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
`;

db.query(createTable, (err, result) => {
    if (err) {
        console.log("Table creation error", err);
    } else {
        console.log("Users table ready");
    }
});