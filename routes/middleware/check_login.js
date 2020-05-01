exports.is_login = (req, res, next) => {
	!req.cookies["jwt"] ? next() : res.redirect("/user/login/callback");
};
