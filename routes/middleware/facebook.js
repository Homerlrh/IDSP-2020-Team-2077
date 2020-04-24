module.exports = (passport) => {
	const is_facebook = (req, res, next) => {
		passport.authenticate(
			"facebook_login",
			{ failureRedirect: "/login" },
			(err, user, info) => {
				if (err) {
					console.log(err);
					return;
				} else {
					req.user = user;
					next();
				}
			}
		)(req, res, next);
	};

	return is_facebook;
};
