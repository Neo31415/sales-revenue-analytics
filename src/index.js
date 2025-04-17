const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const connectDB = require("./utils/db");
const schema = require("./schema/schema");
const config = require('config');

const app = express();
connectDB();

app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        graphiql: true,
    })
);

app.listen(config.get("port"), () => {
    console.log(
        `Server running at http://localhost:${config.get("port")}/graphql`
    );
});
