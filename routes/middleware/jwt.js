module.exports = (passport) => {
	const is_authenticate = (req, res, next) => {
		passport.authenticate("jwt", { session: false }, (err, user, info) => {
			if (!user) {
				console.log(info);
				// req.flash("msg", "Try to log in again.");
				// res.render("error", { msg: req.flash("msg") });
			} else {
				req.user = user;
				next();
			}
		})(req, res, next);
	};

	return is_authenticate;
};
