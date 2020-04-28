module.exports = (passport) => {
	const get_cookie = require("./getcookie");

	const is_facebook = (req, res, next) => {
		passport.authenticate(
			"facebook_login",
			{ failureRedirect: "/login" },
			(err, user, info) => {
				if (err) {
					console.log(err);
					return;
				} else {
					res.cookie("jwt", get_cookie.generateToken({ ...user._json }), {
						expires: new Date(Date.now() + 86400000),
						httpOnly: true,
					});
					req.user = user;
					next();
				}
			}
		)(req, res, next);
	};

	return is_facebook;
};
