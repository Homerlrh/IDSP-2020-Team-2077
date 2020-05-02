const get_cookie = require("../../controllers/auth_controller");

exports.generateToken = (user) => {
	return get_cookie.generateToken(user);
};
