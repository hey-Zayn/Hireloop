const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log("MongoDB connected");
    }).catch((err) => {
        console.log(err);
        console.log("DATABASE Error!!!")

    })
}

module.exports = connectDB;