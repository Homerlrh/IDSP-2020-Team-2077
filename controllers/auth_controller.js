const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
require("dotenv").config();

// generate jwt
function generateToken(user) {
	console.log(user);
	let token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "1day",
	});
	return token;
}

// hash password
function get_hash_password(password) {
	return bcryptjs.hashSync(password, 5);
}

module.exports = { generateToken, get_hash_password };
