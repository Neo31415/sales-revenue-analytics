const mongoose = require("mongoose");
const config = require('config');

const { user, password, host, port, database } = config.get("mongo");

const uri = `mongodb://${user}:${password}@${host}:${port}/${database}?authSource=admin`;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
