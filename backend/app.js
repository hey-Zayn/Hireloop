const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./Config/Database/connection');

const userRoutes = require('./Routes/User.routes');
const errorHandler = require('./Middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/v1/users', userRoutes);

// Global Error Handler
app.use(errorHandler);


connectDB()


module.exports = app;