const express = require("express");
const router = express.Router();

module.exports = (passport) => {
	router.get("/", (req, res) => {
		res.render("content/home", { content_css: "/css/content.css" });
	});

	return router;
};
