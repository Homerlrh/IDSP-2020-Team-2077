const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const fb_strategy = require("passport-facebook").Strategy;
const google_strategy = require("passport-google-oauth20").Strategy;

const user_control = require("../controllers/user_controller");
require("dotenv").config();

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

const localLogin = new LocalStrategy(
	{
		usernameField: "email",
		passwordField: "password",
		session: false,
	},
	async (email, password, done) => {
		user_control.get_user(email, password, (err, user) => {
			if (err) {
				console.log(err);
				return;
			}
			return user
				? done(null, user)
				: done(null, false, {
						error: "Your login details are not valid. Please try again",
				  });
		});
	}
);

const cookieExtractor = function (req) {
	let token = null;
	if (req && req.cookies) {
		try {
			token = req.cookies["jwt"];
			return token;
		} catch (err) {
			return token;
		}
	}
};

const jwtLogin = new JwtStrategy(
	{
		jwtFromRequest: cookieExtractor,
		secretOrKey: process.env.ACCESS_TOKEN_SECRET,
	},
	(payload, done) => {
		const user = userController.get_user_by_id(payload._id);
		return user
			? done(null, user)
			: done(null, false, {
					error: "Your login details are not valid. Please try again",
			  });
	}
);

const fb_login = new fb_strategy(
	{
		clientID: process.env.FACEBOOK_APP_ID,
		clientSecret: process.env.FACEBOOK_APP_SECRET,
		callbackURL: "/user/facebook/callback",
		profileFields: ["id", "email", "displayName", "photos"],
	},
	(accessToken, refreshToken, profile, done) => {
		return profile
			? done(null, profile)
			: done(null, false, {
					error: "Your login details are not valid. Please try again",
			  });
	}
);

const google_login = new google_strategy(
	{
		clientID: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
		callbackURL: "/user/google/callback",
	},
	function (accessToken, refreshToken, profile, done) {
		return profile
			? done(null, profile)
			: done(null, false, {
					error: "Your login details are not valid. Please try again",
			  });
	}
);

module.exports = passport
	.use("local", localLogin)
	.use("jwt", jwtLogin)
	.use("facebook_login", fb_login)
	.use("google_login", google_login);
