const express = require("express"),
	cookieParser = require("cookie-parser"),
	helmet = require("helmet"),
	flash = require("connect-flash"),
	path = require("path"),
	expressLayouts = require("express-ejs-layouts"),
	app = express();

module.exports = (db, passport) => {
	app.use(express.static(path.join(__dirname, "public")));

	app.use(expressLayouts);
	app.set("view engine", "ejs");

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	app.use(passport.initialize());
	app.use(passport.session());

	app.use(cookieParser());
	app.use(flash());

	app.use(helmet());

	//serving login/sign up
	const index_route = require("./routes/index_route")();
	app.use("/", index_route);

	//serving auth method
	const auth_route = require("./routes/auth_routes")(db, passport);
	app.use("/auth", auth_route);

	//serving content {eg. all post ; all category}
	const content_route = require("./routes/content_route")();
	app.use("/content", content_route);

	//serving user account page, login feature
	const user_route = require("./routes/user_routes")(db, passport);
	app.use("/user", user_route);

	return app;
};
