const multer = require("multer");

// Multer storage configuration: Use memory storage to avoid filesystem issues on Vercel
const storage = multer.memoryStorage();

// File filter (optional: restrict to certain types)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf" || file.mimetype === "application/msword" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        cb(null, true);
    } else {
        cb(new Error("Unsupported file type!"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

module.exports = upload;
