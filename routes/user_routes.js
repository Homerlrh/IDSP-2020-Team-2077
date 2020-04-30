const express = require("express");
const router = express.Router();

module.exports = (db, passport) => {
	router
		.route(["/facebook/callback", "/google/callback", "/login/callback"])
		.get((req, res) => {
			console.log("one route");
			res.send(req.user);
		});

	return router;
};
