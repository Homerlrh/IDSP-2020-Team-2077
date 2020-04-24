const express = require("express");
const router = express.Router();

module.exports = () => {
	router.get("/favicon.ico", (req, res) => {
		res.status(404);
	});

	router.get("/", (req, res) => {
		res.render("layout/main");
	});

	router.get("/type/:type", (req, res) => {
		const type = req.params.type;
		type == "login" ? res.render("layout/login") : res.render("layout/sign_up");
	});

	router.get("/logout", (req, res) => {
		res.clearCookie("jwt");
		res.status(204).redirect("/");
	});

	return router;
};
