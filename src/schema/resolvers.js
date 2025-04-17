const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");

module.exports = {
    getCustomerSpending: async (parent, args) => {
        const { customerId } = args;
        console.log(customerId);
        const result = await Order.aggregate([
            { $match: { customerId: customerId, status: "completed" } }, //customer spending for orders where status is "completed"
            {
                $group: {
                    _id: "$customerId",
                    totalSpent: { $sum: "$totalAmount" },
                    averageOrderValue: { $avg: "$totalAmount" },
                    lastOrderDate: { $max: "$orderDate" },
                },
            },
            {
                $project: {
                    customerId: "$_id",
                    totalSpent: 1,
                    averageOrderValue: 1,
                    lastOrderDate: 1,
                    _id: 0,
                },
            },
        ]);

        return result[0] || null;
    },

    getTopSellingProducts: async (parent, args) => {
        const { limit } = args;
        const result = await Order.aggregate([
            { $unwind: "$products" },
            { $match: { status: "completed" } },
            {
                $group: {
                    _id: "$products.productId",
                    totalSold: { $sum: "$products.quantity" },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    productId: "$_id",
                    name: "$product.name",
                    totalSold: 1,
                    _id: 0,
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: limit },
        ]);
        return result;
    },

    getSalesAnalytics: async (parent, args) => {
        const { startDate, endDate } = args;
        const result = await Order.aggregate([
            {
                $match: {
                    status: "completed",
                    orderDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate),
                    },
                },
            },
            {
                $facet: {
                    totalRevenue: [
                        {
                            $group: {
                                _id: null,
                                total: { $sum: "$totalAmount" },
                            },
                        },
                    ],
                    completedOrders: [{ $count: "count" }],
                    categoryBreakdown: [
                        { $unwind: "$products" },
                        {
                            $lookup: {
                                from: "products",
                                localField: "products.productId",
                                foreignField: "_id",
                                as: "productDetails",
                            },
                        },
                        { $unwind: "$productDetails" },
                        {
                            $group: {
                                _id: "$productDetails.category",
                                revenue: {
                                    $sum: {
                                        $multiply: [
                                            "$products.quantity",
                                            "$products.priceAtPurchase",
                                        ],
                                    },
                                },
                            },
                        },
                        {
                            $project: {
                                category: "$_id",
                                revenue: 1,
                                _id: 0,
                            },
                        },
                    ],
                },
            },
        ]);

        return {
            totalRevenue: result[0].totalRevenue[0]?.total || 0,
            completedOrders: result[0].completedOrders[0]?.count || 0,
            categoryBreakdown: result[0].categoryBreakdown,
        };
    },
};
