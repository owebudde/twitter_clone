const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGO_DB } = require("./config.js");
const typeDefs = require("./graphql/type-defs");
const resolvers = require("./graphql/resolvers");

/**
 * Info: https://www.youtube.com/watch?v=n1mdAPFq2Os
 */

const pubsub = new PubSub();

const PORT = process.env.port || 4200;

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req, pubsub }), // forward request body to context (access headers).
});

mongoose
	.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB connected");
		return server.listen({ port: PORT });
	})
	.then((res) => {
		console.log(`Server running on ${res.url}`);
	})
	.catch((err) => console.error(err));
