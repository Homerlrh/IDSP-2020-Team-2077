const jwt = require("jsonwebtoken");
require("dotenv").config();

// generate jwt
function generateToken(user) {
	console.log(user);
	let token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: 604800,
	});
	return token;
}

// verify jwt
function verifyToken(token) {
	const state = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (
		err
	) {
		if (err) {
			console.log(err);
			return false;
		}
		return true;
	});
	return state;
}

module.exports = { generateToken, verifyToken };
