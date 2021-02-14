module.exports.validateRegisterInput = (username, email, password, confrimPassword) => {
	const errors = {};

	// Username validation.
	if (username.trim() === "") {
		errors.username = "Username must not be empty";
	}

	// Email validation.
	if (email.trim() === "") {
		errors.email = "Email must not be empty";
	} else {
		const emailRegex = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

		if (!email.match(emailRegex)) {
			errors.email = "Email must be a valid email address";
		}
	}

	// Password.
	if (password === "") {
		errors.password = "Password cannot be empty";
	} else if (password !== confrimPassword) {
		errors.confrimPassword = "Passwords must match";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};

module.exports.validateLoginInput = (username, password) => {
	const errors = {};

	// Username validation.
	if (username.trim() === "") {
		errors.username = "Username cannot be empty";
	}

	// Username validation.
	if (password === "") {
		errors.password = "Password cannot be empty";
	}

	return {
		errors,
		valid: Object.keys(errors).length < 1,
	};
};
