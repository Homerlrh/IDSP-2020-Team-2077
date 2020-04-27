const mysql = require("mysql");

const connection = mysql.createConnection({
	user: process.env.admin,
	password: process.env.password,
	database: `craigslist`,
	host: process.env.DSN || "35.203.176.28",
});

connection.connect(function (err, connection) {
	if (err) {
		console.log(err.message);
		return;
	} else {
		console.log(`Database connected`);
	}
});

exports.get_all_user = (cb) => {
	connection.query(`SELECT * FROM user`, cb);
};

exports.get_user_by_email = (email, cb) => {
	connection.query(`SELECT * FROM user WHERE email = ?`, [email], cb);
};

exports.is_user = (email, cb) => {
	// const stm = { user: email };
	connection.query(
		"SELECT CASE WHEN EXISTS ( SELECT email FROM user WHERE email = ?) then TRUE else FALSE end as bool",
		[email],
		cb
	);
};

exports.create_user = (info, cb) => {
	connection.query(`INSERT INTO user SET ?`, info, cb);
};

exports.get_user_by_id = (id, cb) => {
	connection.query(`SELECT * FROM user WHERE id = ?`, [id], cb);
};
