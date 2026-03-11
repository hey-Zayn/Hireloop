const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('./Middlewares/sanitize.middleware');
const rateLimit = require('express-rate-limit');
const connectDB = require('./Config/Database/connection');

const userRoutes = require('./Routes/User.routes');
const companyRoutes = require('./Routes/Company.routes');
const errorHandler = require('./Middlewares/error.middleware');

const app = express();

// 1. Security Headers & CORS
app.use(helmet());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

// 2. Body Parsers (Required before Sanitization)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 3. Sanitization (After body parsing)
app.use(mongoSanitize);

// 4. Rate Limiting
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/v1/users', authLimiter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Health Check
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'System is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        env: process.env.NODE_ENV
    });
});

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/companies', companyRoutes);

// Global Error Handler
app.use(errorHandler);


connectDB()


module.exports = app;