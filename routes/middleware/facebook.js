module.exports = (passport) => {
	const get_cookie = require("./getcookie");

	const is_facebook = (req, res, next) => {
		passport.authenticate(
			"facebook_login",
			{ failureRedirect: "/login" },
			(err, user, info) => {
				if (err) {
					return res.send(err);
				} else {
					req.user = user;
					next();
				}
			}
		)(req, res, next);
	};

	return is_facebook;
};
