const mysql = require("mysql");

const connection = mysql.createConnection({
	user: process.env.admin,
	password: process.env.password,
	database: `craigslist`,
	host: process.env.DSN || "35.203.176.28",
	ssl: {
		ca: process.env.ca.replace(/\\n/g, "\n"),
		cert: process.env.cert.replace(/\\n/g, "\n"),
		key: process.env.key.replace(/\\n/g, "\n"),
	},
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

exports.get_category = (cb) => {
	connection.query(`SELECT type FROM category`, cb);
};

exports.get_category_id = (type, cb) => {
	connection.query(`SELECT id FROM category WHERE type = ?`, [type], cb);
};

exports.get_subcategory = (category_id, cb) => {
	connection.query(
		`SELECT name FROM sub_category WHERE category_id = ?`,
		[category_id],
		cb
	);
};

exports.get_all_post_by_category = (category, sub_category_id, cb) => {
	connection.query(
		"SELECT * FROM view_post_img_detail WHERE main_category = ? AND sub_category = ?",
		[category, sub_category_id],
		cb
	);
};

// function a() {
// 	connection.query(
// 		`CREATE OR REPLACE VIEW view_post_img_detail AS
// 	SELECT
// 		post.id AS post_id,
// 		post.title AS post_title,
// 		post.description AS post_detail,
// 		post.price AS price,
// 		post.condition AS item_condition,
// 		post.seller_id AS seller_id,
// 		post.category_id AS main_category,
// 		post.sub_category_id AS sub_category,
// 		CONCAT(post.area," ",post.province)AS location,
// 		post.created_at AS date,
// 		JSON_ARRAYAGG(image.img_url) As image
// 	FROM post JOIN image
// 		ON post.id = image.post_id
// 	GROUP BY post.id
// 	ORDER BY post.created_at;`,
// 		(err) => {
// 			err ? console.log(err.message) : console.log("updated");
// 		}
// 	);
// }

// a();
