const { gql } = require("apollo-server");

module.exports = gql`
	type Post {
		id: ID!
		body: String!
		createdAt: String!
		username: String!
		comments: [Comment]!
		likes: [Like]!
		likeCount: Int!
		commentCount: Int!
	}

	input RegisterInput {
		username: String!
		password: String!
		confirmPassword: String!
		email: String!
	}

	type User {
		id: ID!
		email: String!
		token: String!
		username: String!
		createdAt: String!
	}

	type Query {
		getPosts: [Post]
		getPost(postId: ID!): Post
	}

	type Comment {
		id: ID!
		username: String!
		createdAt: String!
		body: String!
	}

	type Like {
		id: ID!
		username: String!
		createdAt: String!
	}

	type Subscription {
		newPost: Post!
	}

	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		createPost(body: String!): Post!
		deletePost(postId: ID!): String!
		createComment(postId: String!, body: String!): Post!
		deleteComment(postId: ID!, commentId: ID!): Post!
		likePost(postId: ID!): Post!
	}
`;
