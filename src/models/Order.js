const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Order",
    new mongoose.Schema({
        _id: String,
        customerId: String,
        products: [
            {
                productId: String,
                quantity: Number,
                priceAtPurchase: Number,
            },
        ],
        totalAmount: Number,
        orderDate: Date,
        status: String,
    })
);
