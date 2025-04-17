const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Customer",
    new mongoose.Schema({
        _id: String,
        name: String,
        email: String,
        age: Number,
        location: String,
        gender: String,
    })
);
