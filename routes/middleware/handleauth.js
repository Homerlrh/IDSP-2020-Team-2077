const passport = require("../../passport/passport");

const is_facebook = require("./facebook")(passport);

const is_google = require("./google")(passport);

const is_authenticate = require("./jwt")(passport);

function is_login(req, res, next) {
	req.cookies["jwt"] ? next() : res.redirect("/");
}

exports.handle_auth = (req, res, next) => {
	switch (req._parsedUrl.pathname) {
		case "/user/facebook/callback":
			return is_facebook(req, res, next);
		case "/user/google/callback":
			return is_google(req, res, next);
		case "/user/login/callback":
			return is_authenticate(req, res, next);
		default:
			is_login(req, res, next);
	}
};
