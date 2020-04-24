const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controller");

module.exports = (db, passport) => {
	router.post("/login", (req, res, next) => {
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

	router.get("/google_signin", (req, res) => {
		console.log("g");
	});
	return router;
};
