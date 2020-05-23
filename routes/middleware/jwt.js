module.exports = (passport) => {
	const is_authenticate = (req, res, next) => {
		passport.authenticate("jwt", { session: false }, (err, user, info) => {
			if (!user) {
				res.send(err);
				res.redirect("/type/login");
				return;
			}
			req.user = user;
			next();
		})(req, res, next);
	};

	return is_authenticate;
};
