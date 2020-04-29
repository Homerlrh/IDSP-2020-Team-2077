const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controller");

module.exports = (db, passport) => {
	router
		.route("/login")
		.get((req, res) => {
			res.render("layout/login");
		})
		.post((req, res, next) => {
			const { email, password } = req.body;
			db.is_user(email, (err, rows) => {
				const is_user = rows[0].bool;
				if (!is_user) {
					res.render("layout/login", {
						msg: "You are not a user, please login first",
					});
				} else {
					passport.authenticate(
						"local",
						{ session: false },
						(err, user, info) => {
							if (err || !user) {
								res.render("layout/login", {
									msg: info.error,
								});
								return;
							}
							req.login(user, { session: false }, (err) => {
								if (err) {
									res.send(err.message);
								}
								delete user.password; // delete password from token
								const payload = { ...user };
								const token = auth_controller.generateToken(payload);
								res
									.cookie("jwt", token, {
										expires: new Date(Date.now() + 86400000),
										httpOnly: true,
									})
									.redirect("/content/home");
							});
						}
					)(req, res, next);
				}
			});
		});

	router.get(
		"/fb_signin",
		passport.authenticate("facebook_login", { scope: "email" })
	);

	router.get(
		"/google_signin",
		passport.authenticate("google_login", {
			scope: ["profile", "email"],
		})
	);

	router
		.route("/sign_up")
		.get((req, res) => {
			res.render("layout/sign_up");
		})
		.post((req, res) => {
			const user_info = { ...req.body };
			db.is_user(user_info.email, (err, rows) => {
				const is_user = rows[0].bool;
				if (is_user) {
					res.render("layout/login", {
						msg:
							"You have already register an account with that email, please login",
					});
				} else {
					delete user_info.confirm;
					delete user_info.Confirm_Password;
					user_info.password = auth_controller.get_hash_password(
						user_info.password
					);
					db.create_user(user_info, (err, result) => {
						if (err) {
							return console.log(err.message);
						}
						db.get_user_by_id(result.insertId, (err, rows) => {
							if (err) {
								console.log(err.message);
							}
							const found_user = { ...rows[0] };
							const token = auth_controller.generateToken(found_user);
							res
								.cookie("jwt", token, {
									expires: new Date(Date.now() + 86400000),
									httpOnly: true,
								})
								.redirect("/content/home");
						});
					});
				}
			});
		});

	return router;
};
