const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

module.exports = (db) => {
	app.use(express.static(path.join(__dirname, "public")));
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());

	const indexRouter = require("./Routes/IndexRoute")();
	app.use("/", indexRouter);
	return app;
};
