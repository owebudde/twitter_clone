const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

const { MONGO_DB } = require("./config.js");

/**
 * Tutorial: https://www.youtube.com/watch?v=n1mdAPFq2Os
 */

const typeDefs = gql`
	type Query {
		sayHi: String!
	}
`;

const resolvers = {
	Query: {
		sayHi: () => "Hello world!",
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

mongoose
	.connect(MONGO_DB, { useNewUrlParser: true })
	.then(() => {
		console.log("MongoDB connected");
		return server.listen({ port: 4200 });
	})
	.then((res) => {
		console.log(`Server running on ${res.url}`);
	})
	.catch((err) => console.error(err));
