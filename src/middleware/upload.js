const multer = require('multer');
const path = require('path');

// Sirf images allow karne ka filter
const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPG/PNG images are allowed'), false);
    }
};

// ─── Profile Image (Register ke liye) ───────────────────────────
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile/');
    },
    filename: (req, file, cb) => {
        // Space ko hyphen (-) se replace kar rahe hain
        const cleanName = file.originalname.replace(/\s+/g, '-');
        const uniqueName = Date.now() + '-' + cleanName;
        cb(null, uniqueName);
    }
});

const uploadProfileImage = multer({
    storage: profileStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // max 2MB
});

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products/');
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(/\s+/g, '-');
        const uniqueName = Date.now() + '-' + cleanName;
        cb(null, uniqueName);
    }
});

const uploadProductImage = multer({
    storage: productStorage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // max 5MB
});

module.exports = { uploadProfileImage, uploadProductImage };
