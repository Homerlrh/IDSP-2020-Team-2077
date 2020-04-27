const express = require("express");
const router = express.Router();

module.exports = (db, passport) => {
	const is_facebook = require("./middleware/facebook")(passport);
	router.get("/facebook/callback", is_facebook, (req, res) => {
		console.log(req.user.id);
		res.send(req.user._json);
	});

	const is_google = require("./middleware/google")(passport);
	router.get("/google/callback", is_google, (req, res) => {
		res.send(req.user._json);
	});

	return router;
};
