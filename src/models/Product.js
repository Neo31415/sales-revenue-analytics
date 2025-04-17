const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Product",
    new mongoose.Schema({
        _id: String,
        name: String,
        category: String,
        price: Number,
        stock: Number,
    })
);
