const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLFloat,
    GraphQLInt,
} = require("graphql");
const resolvers = require("./resolvers");

const CustomerSpendingType = new GraphQLObjectType({
    name: "CustomerSpending",
    fields: () => ({
        customerId: { type: GraphQLID },
        totalSpent: { type: GraphQLFloat },
        averageOrderValue: { type: GraphQLFloat },
        lastOrderDate: { type: GraphQLString },
    }),
});

const TopProductType = new GraphQLObjectType({
    name: "TopProduct",
    fields: () => ({
        productId: { type: GraphQLID },
        name: { type: GraphQLString },
        totalSold: { type: GraphQLInt },
    }),
});

const CategoryRevenueType = new GraphQLObjectType({
    name: "CategoryRevenue",
    fields: () => ({
        category: { type: GraphQLString },
        revenue: { type: GraphQLFloat },
    }),
});

const SalesAnalyticsType = new GraphQLObjectType({
    name: "SalesAnalytics",
    fields: () => ({
        totalRevenue: { type: GraphQLFloat },
        completedOrders: { type: GraphQLInt },
        categoryBreakdown: { type: new GraphQLList(CategoryRevenueType) },
    }),
});

const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        getCustomerSpending: {
            type: CustomerSpendingType,
            args: { customerId: { type: GraphQLID } },
            resolve: resolvers.getCustomerSpending,
        },
        getTopSellingProducts: {
            type: new GraphQLList(TopProductType),
            args: { limit: { type: GraphQLInt } },
            resolve: resolvers.getTopSellingProducts,
        },
        getSalesAnalytics: {
            type: SalesAnalyticsType,
            args: {
                startDate: { type: GraphQLString },
                endDate: { type: GraphQLString },
            },
            resolve: resolvers.getSalesAnalytics,
        },
    },
});

module.exports = new GraphQLSchema({ query: RootQuery });
