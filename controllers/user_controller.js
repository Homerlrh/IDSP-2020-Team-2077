const db = require("../database/DB");
const bcrypt = require("bcryptjs");

const is_correct = (user, password) => {
	return bcrypt.compareSync(password, user.password);
};

exports.get_user = (email, password, cb) => {
	db.get_user_by_email(email, (err, user) => {
		if (err) {
			cb(err, err.message);
		} else {
			if (is_correct(user[0], password)) {
				delete user[0].password;
				cb(null, user[0]);
			} else {
				cb(err, null);
			}
		}
	});
};

exports.get_user_by_id = (id, cb) => {
	db.get_user_by_id(id, (err, user) => {
		if (err) {
			cb(err, err.message);
		} else {
			delete user.password;
			cb(null, user);
		}
	});
};
