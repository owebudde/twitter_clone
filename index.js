const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

const Post = require("./models/Post");
const { MONGO_DB } = require("./config.js");

/**
 * Tutorial: https://www.youtube.com/watch?v=n1mdAPFq2Os
 */

const typeDefs = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
	}
	type Query {
		getPosts: [Post]
	}
`;

const resolvers = {
	Query: {
		getPosts: async () => {
			try {
				const posts = await Post.find();
				return posts;
			} catch (error) {
				throw new Error(error);
			}
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

mongoose
	.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB connected");
		return server.listen({ port: 4200 });
	})
	.then((res) => {
		console.log(`Server running on ${res.url}`);
	})
	.catch((err) => console.error(err));
