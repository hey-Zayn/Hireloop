const mongoose = require("mongoose");
const logger = require("../../libs/logger");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        logger.info("MongoDB connected successfully");
    } catch (err) {
        logger.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;