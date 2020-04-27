module.exports = (passport) => {
	const is_google = (req, res, next) => {
		passport.authenticate(
			"google_login",
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

	return is_google;
};
