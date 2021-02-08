const { model, Schema } = require("mongoos");

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createdAt: String,
});

module.exports = model("User", userSchema);
