const express = require("express");
const path = require("path");

const router = express.Router();

module.exports = () => {
	router.get("/", (req, res) => {
		res.sendFile(path.join(__dirname, "../view/main.html"));
	});
	router.get("/index", (req, res) => {
		res.sendFile(path.join(__dirname, "../view/index.html"));
	});

	router.get("/confirmation", (req, res) => {
		res.sendFile(path.join(__dirname, "../view/confirmation.html"));
	});

	router.get("/login", (req, res) => {
		res.send("login page");
	});

	router.get("/signup", (req, res) => {
		res.sendFile(path.join(__dirname, "../view/create__account.html"));
	});

	router.get("/userInfo", (req, res) => {
		res.sendFile(path.join(__dirname, "../view/personal__info.html"));
	});

	router.get("/service", (req, res) => {
		res.sendFile(path.join(__dirname, "../view/terms__service.html"));
	});

	return router;
};
