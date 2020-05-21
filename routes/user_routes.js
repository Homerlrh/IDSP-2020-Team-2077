const express = require("express");
const AWS = require("./photo_upload/aws");
const router = express.Router();
const filter = require("./helper_function/filter_user").get_other_user;

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
					if (err) {
						return console.log(err.message);
					}
					set_cookie(req, res, rows[0].id);
				});
				return;
			}
			db.create_user(info, (err, result) => {
				if (err) {
					return console.log(err.message);
				}
				set_cookie(req, res, result.insertId);
			});
		});
	});

	router.get("/login/callback", (req, res) => {
		const user_id = req.user.id;
		db.get_post_by_user_id(user_id, (err, rows) => {
			if (err) {
				return console.log(err.message);
			}
			db.get_favorite_post_by_user_id(user_id, (req, row) => {
				if (err) {
					return console.log(err.message);
				}
				db.get_chat_room_by_user_id(user_id, (err, room) => {
					const chatrooms = filter(room, user_id);
					if (err) {
						return console.log(err.message);
					}
					res.render("account/account", {
						content_css: " ",
						latest_post: rows,
						favorite_post: JSON.parse(row[0].favorite_post),
						chatrooms: chatrooms,
						footer: false,
						d_sidebar: false,
					});
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
				d_sidebar: false,
			});
		})
		.post(AWS.upload.array("pic"), (req, res) => {
			const post_body = { ...req.body };
			const files = [...req.files];
			db.create_post(post_body, (err, result) => {
				if (err) {
					return res.send(err);
				}
				files.forEach((file) => {
					let img_url = `https://d39wlfkh0mxxlz.cloudfront.net/${file.originalname}`;
					db.upload_photo(
						{ img_url: img_url, post_id: result.insertId },
						(err, result) => {
							err ? console.log(err) : console.log(result.insertId);
						}
					);
				});
				res.redirect(`/content/post_detail/${result.insertId}`);
			});
		});

	router
		.route("/setting")
		.get((req, res) => {
			res.render("account/account_setting", {
				content_css: " ",
				user: req.user,
				footer: false,
				a_c: true,
				d_sidebar: false,
			});
		})
		.post(AWS.upload.single("avatar"), (req, res) => {
			const {
				user_id,
				username,
				email,
				phone_number,
				street,
				city,
				province,
				postcode,
			} = { ...req.body };
			const avatar = req.file
				? `${process.env.cloudFront}${req.file.originalname}`
				: req.user.avatar;
			const stmt = [
				avatar,
				username,
				phone_number,
				street,
				city,
				province,
				postcode,
				user_id,
			];
			db.update_user(stmt, (err, row) => {
				if (err) {
					return res.send("opps, please try again later");
				}
				res.send("updated");
			});
		});

	router.get("/user-favorite/", (req, res) => {
		const id = req.user.id;
		db.get_favorite_post_by_user_id(id, (err, rows) => {
			if (err) {
				return res.send(err);
			}
			res.render("content/post", {
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
		if (req.user) {
			state == "like"
				? db.add_favourite(
						{ user_id: id, post_id: Number(post) },
						(err, rows) => {
							if (err) {
								return res.send(err);
							}
							res.send("liked");
						}
				  )
				: db.unlike([id, Number(post)], (err, rows) => {
						if (err) {
							return res.send(err);
						}
						res.send("unliked");
				  });
		} else {
			res.send("please log in first");
		}
	});

	return router;
};
