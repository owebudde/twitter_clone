const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const { validateRegisterInput, validateLoginInput } = require("../../utils/validation");

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id, // the document id from mongodb
			email: user.email,
			username: user.username,
		},
		SECRET_KEY,
		{
			expiresIn: "12h", // TODO: Reduce this.
		}
	);
}

module.exports = {
	Mutation: {
		async register(parent, { registerInput: { username, email, password, confirmPassword } }, context, info) {
			// Validate user data.
			const { valid, errors } = validateRegisterInput(username, email, password, confirmPassword);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			// Check if user already exists
			// TODO: check if email already exists.
			const userExists = await User.findOne({ username });
			if (userExists) {
				throw new UserInputError("Username already exists", {
					errors: {
						username: "This username is taken",
					},
				});
			}

			// Hash password and create auth token
			const hashedPW = await bcrypt.hash(password, 12);
			const newUser = new User({
				email,
				username,
				password: hashedPW,
				createdAt: new Date().toISOString(),
			});

			const result = await newUser.save();

			const token = generateToken(result);

			return {
				...result._doc,
				id: result._id,
				token,
			};
		},

		async login(parent, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const user = await User.findOne({ username });
			const passwordMatch = await bcrypt.compare(password, user.password);

			if (!user) {
				errors.general = "User not found";
				throw new UserInputError("Incorrect username", { errors });
			}

			if (!passwordMatch) {
				errors.general = "Incorrect password";
				throw new UserInputError("Incorrect password", { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
	},
};
