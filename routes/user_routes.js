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
		db.get_post_by_user_id(req.user.id, (err, rows) => {
			err
				? console.log(err)
				: res.render("account/account", {
						content_css: "/css/2main.css",
						latest_post: rows,
				  });
		});
	});

	router
		.route("/create_post")
		.get((req, res) => {
			res.render("account/create_post", {
				content_css: "/css/2main.css",
				user_id: req.user.id,
				avatar: req.user.avatar,
				email: req.user.email,
				phone: req.user.phone_number == "" ? "n/a" : req.user.phone_number,
			});
		})
		.post(AWS.upload.single("pic"), (req, res) => {
			const post_body = { ...req.body };
			const file_name = req.file.originalname;
			const img_url = `https://d39wlfkh0mxxlz.cloudfront.net/${file_name}`;
			db.create_post(post_body, (err, result) => {
				err
					? console.log(err)
					: db.upload_photo(
							{ img_url: img_url, post_id: result.insertId },
							(err, result) => {
								err ? console.log(err) : res.redirect("/user/login/callback");
							}
					  );
			});
		});

	router.get("/account_setting", (req, res) => {
		res.send(req.user);
	});

	router.get("/user-favorite", (req, res) => {
		const id = req.user.id;
		db.get_favorite_post_by_user_id(id, (err, rows) => {
			err ? res.send(err) : res.send(JSON.parse(rows[0].favorite_post));
		});
	});

	return router;
};
