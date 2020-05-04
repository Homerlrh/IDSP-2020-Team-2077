module.exports = (passport) => {
	const is_authenticate = (req, res, next) => {
		passport.authenticate("jwt", { session: false }, (err, user, info) => {
			if (!user) {
				console.log(err);
				res.redirect("/type/login");
			} else {
				if (!req.user) {
					req.user = user;
				}
				next();
			}
		})(req, res, next);
	};

	return is_authenticate;
};
