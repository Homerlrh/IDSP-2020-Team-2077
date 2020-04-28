const express = require("express");
const router = express.Router();

module.exports = (db, passport) => {
	const is_facebook = require("./middleware/facebook")(passport);
	router.get("/facebook/callback", is_facebook, (req, res) => {
		console.log(req.user.id);
		res.send(req.user);
	});

	const is_google = require("./middleware/google")(passport);
	router.get("/google/callback", is_google, (req, res) => {
		console.log(req.user.id);
		console.log("you passed");
		res.send(req.user);
	});

	const is_authenticate = require("./middleware/jwt")(passport);
	router.get("/callback", is_authenticate, (req, res) => {});

	return router;
};
