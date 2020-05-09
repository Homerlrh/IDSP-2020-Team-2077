const express = require("express");
const AWS = require("./photo_upload/aws");
const router = express.Router();

module.exports = (db, passport, auth_controller) => {
	const set_cookie = require("./helper_function/create_cookie")(
		db,
		auth_controller
	);
	router.route(["/facebook/callback", "/google/callback"]).get((req, res) => {
		console.log("i am oauth log in");
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
				console.log(is_user);
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
				: db.get_favorite_post_by_user_id(req.user.id, (req, row) => {
						err
							? console.log(err)
							: res.render("account/account", {
									content_css: " ",
									latest_post: rows,
									favorite_post: JSON.parse(row[0].favorite_post),
									footer: false,
							  });
				  });
		});
	});

	router
		.route("/create_post")
		.get((req, res) => {
			res.render("account/create_post", {
				content_css: " ",
				user_id: req.user.id,
				avatar: req.user.avatar,
				email: req.user.email,
				phone: req.user.phone_number == "" ? "n/a" : req.user.phone_number,
				footer: false,
				preview: true,
			});
		})
		.post(AWS.upload.array("pic"), (req, res) => {
			const post_body = { ...req.body };
			const files = [...req.files];
			db.create_post(post_body, (err, result) => {
				err
					? console.log(err)
					: files.forEach((file) => {
							let img_url = `https://d39wlfkh0mxxlz.cloudfront.net/${file.originalname}`;
							db.upload_photo(
								{ img_url: img_url, post_id: result.insertId },
								(err, result) => {
									err ? console.log(err) : console.log(result.insertId);
								}
							);
					  });
			});
			res.redirect("/user/create_post");
		});

	router.get("/setting", (req, res) => {
		res.send(req.user);
	});

	router.get("/user-favorite/", (req, res) => {
		const id = req.user.id;
		db.get_favorite_post_by_user_id(id, (err, rows) => {
			err
				? res.send(err)
				: res.render("content/post", {
						content_css: "f",
						title: "favourite",
						post: JSON.parse(rows[0].favorite_post),
				  });
		});
	});

	router.post("/user-favorite/:post_id", (req, res) => {
		const id = req.user.id;
		const post = req.params.post_id;
		const state = req.body.state;
		console.log(state == "like");
		db.add_favourite({ user_id: id, post_id: Number(post) }, (err, rows) => {
			err ? res.send(err.message) : res.send("success");
		});
	});

	return router;
};
