const express = require("express");
const router = express.Router();

module.exports = (passport) => {
	router.get("/", (req, res) => {
		res.send("dash");
	});

	return router;
};
