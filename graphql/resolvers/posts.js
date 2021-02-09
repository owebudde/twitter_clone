const { AuthenticationError } = require("apollo-server");
const Post = require("../../models/Post");
const checkAuth = require("../../utils/auth");

module.exports = {
	Query: {
		getPosts: async () => {
			try {
				// Find the posts and sort created desc.
				const posts = await Post.find().sort({ createdAt: -1 });
				return posts;
			} catch (error) {
				throw new Error(error);
			}
		},

		getPost: async (_, { postId }) => {
			try {
				const post = await Post.findById(postId);
				if (post) {
					return post;
				} else {
					throw new Error("post not found");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
	},

	Mutation: {
		createPost: async (_, { body }, context) => {
			const user = checkAuth(context);

			const newPost = new Post({
				body,
				user: user.id,
				username: user.username,
				createdAt: new Date().toISOString(),
			});

			const post = await newPost.save();

			return post;
		},

		deletePost: async (_, { postId }, context) => {
			const user = checkAuth(context);

			try {
				const post = await Post.findById(postId);
				if (user.username === post.username) {
					await post.delete();
					return "Post deleted";
				} else {
					throw new AuthenticationError("Action not allowed");
				}
			} catch (error) {
				throw new Error(error);
			}
		},
	},
};
