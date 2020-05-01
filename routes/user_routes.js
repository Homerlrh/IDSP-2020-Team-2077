const express = require("express");
const AWS = require("./photo_upload/aws");
const formidable = require("formidable");
const router = express.Router();

module.exports = (db, passport, auth_controller) => {
	const set_cookie = require("./helper_function/create_cookie")(
		db,
		auth_controller
	);
	router.route(["/facebook/callback", "/google/callback"]).get((req, res) => {
		db.is_user(req.user._json.email, (err, rows) => {
			const is_user = rows[0].bool;
			const user = { ...req.user._json };
			const info = {
				avatar: user.picture.data ? user.picture.data.url : user.picture,
				username: user.name,
				email: user.email,
				password: user.sub ? user.sub : user.id,
				street: "",
				city: "",
				province: "",
			};
			console.log(is_user);
			if (is_user) {
				db.get_user_id_by_email(req.user._json.email, (err, rows) => {
					err ? console.log(err.message) : set_cookie(req, res, rows[0].id);
				});
				return;
			}
			db.create_user(info, (err, result) => {
				err ? console.log(err.message) : set_cookie(req, res, result.insertId);
			});
		});
	});

	router.get("/login/callback", (req, res) => {
		res.render("account/account", {
			content_css: "/css/user.css",
		});
	});

	router
		.route("/create_post")
		.get((req, res) => {
			console.log(1);
			res.render("account/create_post", {
				content_css: "/css/user.css",
			});
		})
		.post(AWS.upload.single("pic"), (req, res) => {
			new formidable.IncomingForm()
				.parse(req)
				.on("field", (name, field) => {
					console.log("Field", name, field);
				})
				.on("file", (name, file) => {
					console.log("Uploaded file", file.name);
				});

			// https://d39wlfkh0mxxlz.cloudfront.net/
		});

	return router;
};
