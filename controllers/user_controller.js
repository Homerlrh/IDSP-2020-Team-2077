const db = require("../database/DB");
const bcrypt = require("bcryptjs");

const is_correct = (user, password) => {
	// return await bcrypt.compareSync(password, user.password);
	return user.password === password;
};

exports.get_user = (email, password, cb) => {
	db.get_user_by_email(email, (err, user) => {
		if (err) {
			cb(false, err.message);
		} else {
			if (is_correct(user[0], password)) {
				delete user[0].password;
				cb(null, user[0]);
			} else {
				return false;
			}
		}
	});
};
