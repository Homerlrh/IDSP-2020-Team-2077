const express = require("express");
const check = require("./middleware/check_login");
const router = express.Router();

module.exports = () => {
	router.get("/favicon.ico", (req, res) => {
		res.status(404);
	});

	router.get("/", (req, res) => {
		res.render("layout/main");
	});

	router.get("/type/:type", check.is_login, (req, res) => {
		req.params.type == "login"
			? res.render("layout/login")
			: res.render("layout/sign_up", { signup: true });
	});

	router.get("/logout", (req, res) => {
		res.clearCookie("jwt");
		res.status(204).redirect("/");
	});

	return router;
};
