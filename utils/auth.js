const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;

	if (authHeader) {
		// Bearer token.
		const token = authHeader.split("Bearer ")[1];

		// Validate the token.
		if (token) {
			try {
				const user = jwt.verify(token, SECRET_KEY);
				console.log("USER: ", user);
				return user;
			} catch (error) {
				throw new AuthenticationError("Invalid/Expired Token");
			}
		}

		throw new Error("Authentication token [Bearer][token]");
	}

	throw new Error("Authorization header not provided");
};
