const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controller");
const { body, check, validationResult } = require("express-validator");

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
						async (err, user, info) => {
							if (err || !user) {
								res.render("layout/login", {
									msg: info.error,
								});
							}
							req.login(user, { session: false }, async (err) => {
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
									.redirect("/content");
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
			scope: [
				"https://www.googleapis.com/auth/userinfo.profile",
				"https://www.googleapis.com/auth/userinfo.email",
			],
		})
	);

	router
		.route("/sign_up")
		.get((req, res) => {
			res.render("layout/sign_up");
		})
		.post(
			[
				check("Username")
					.not()
					.isEmpty()
					.withMessage("Username can not be null"),
				check("email").isEmail().withMessage("Email formate is not correct"),
				check("password")
					.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/)
					.withMessage(
						"Password: At least one Upper case and one lower case must be at least 6 characters long"
					)
					.matches(/\d/)
					.withMessage("Password: must contain a number"),
			],
			body("Confirm_Password").custom((value, { req }) => {
				if (value !== req.body.password) {
					throw new Error("Password confirmation does not match password");
				}
				// Indicates the success of this synchronous custom validator
				return true;
			}),
			(req, res) => {
				const errors = validationResult(req);
				if (!errors.isEmpty()) {
					console.log(errors.array());
				}
				res.render("layout/sign_up", {
					errmsg: errors.array(),
				});
				console.log(req.body);
			}
		);
	return router;
};
