const passport = require("../../passport/passport");
const is_facebook = require("./facebook")(passport);

const is_google = require("./google")(passport);

const is_authenticate = require("./jwt")(passport);

exports.handle_auth = (req, res, next) => {
	switch (req._parsedUrl.pathname) {
		case "/user/facebook/callback":
			return is_facebook(req, res, next);
		case "/user/google/callback":
			return is_google(req, res, next);
		case "/callback":
			return is_authenticate(req, res, next);
		default:
			res.redirect("/login");
	}
};
