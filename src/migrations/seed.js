const mongoose = require("mongoose");
const connectDB = require("../utils/db");
const Customer = require("../models/Customer");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { convertToObject, parseCSV } = require("../utils/helper");


const run = async () => {
    await connectDB();

    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    const customers = await parseCSV("customers.csv");
    const products = await parseCSV("products.csv");
    const ordersRaw = await parseCSV("orders.csv");

    await Customer.insertMany(customers);
    await Product.insertMany(products);

    const orders = ordersRaw.map((order) => {
        let productsParsed = [];

        try {
            const fixed = convertToObject(order.products);
            productsParsed = fixed.map((p) => {
                return {
                    productId: p.productId,
                    quantity: p.quantity,
                    priceAtPurchase: p.priceAtPurchase,
                };
            });
        } catch (err) {
            console.error(
                `Failed to parse products for order ${order._id}:`,
                err.message
            );
        }

        return {
            _id: order._id,
            customerId: order.customerId,
            products: productsParsed,
            totalAmount: parseFloat(order.totalAmount),
            orderDate: new Date(order.orderDate),
            status: order.status,
        };
    });

    await Order.insertMany(orders);

    console.log("Seeded from CSV files");
    mongoose.disconnect();
};

run();
