require("dotenv").config();
const Mongoose = require("mongoose");
Mongoose.set('strictQuery', false);
const remoteDB = process.env.MONGODB_URI;
const connectDB = async () => {
    await Mongoose.connect(remoteDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
};

module.exports = connectDB;