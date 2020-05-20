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
	connection.query(`SELECT * FROM view_all_category`, cb);
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
		`SELECT * FROM view_post_img_detail
		WHERE CASE WHEN ? IS NOT NULL THEN main_category = ? ELSE 1=1 END
		AND CASE WHEN ? IS NOT NULL THEN sub_category = ? ELSE 1=1 END
		AND date > now() - interval 30 day
		`,
		[category, category, sub_category_id, sub_category_id],
		cb
	);
};

exports.get_user_id_by_email = (email, cb) => {
	connection.query(`SELECT id FROM user WHERE email = ?`, [email], cb);
};

exports.create_post = (info, cb) => {
	connection.query(`INSERT INTO post SET ?`, info, cb);
};

exports.upload_photo = (photo, cb) => {
	connection.query(`INSERT INTO image SET ?`, photo, cb);
};

exports.get_post_detail = (id, cb) => {
	connection.query(
		`SELECT * FROM view_post_detail_user WHERE date > now() - interval 30 day AND post_id = ? `,
		[id],
		cb
	);
};

exports.get_post_by_user_id = (id, cb) => {
	connection.query(
		`SELECT * FROM view_post_img_detail WHERE date > now() - interval 30 day AND seller_id = ?`,
		[id],
		cb
	);
};

exports.get_favorite_post_by_user_id = (id, cb) => {
	connection.query(
		`SELECT * FROM view_user_favorite_post WHERE id = ?`,
		[id],
		cb
	);
};

exports.add_favourite = (info, cb) => {
	connection.query(`INSERT INTO favorite_post SET ?`, info, cb);
};

exports.unlike = (info, cb) => {
	connection.query(
		`DELETE FROM favorite_post WHERE user_id = ? AND post_id = ?`,
		info,
		cb
	);
};

exports.detect_likes = (post_id, cb) => {
	connection.query(
		`SELECT post.id, JSON_ARRAYAGG(user.id) AS liked_user
		FROM post
		LEFT JOIN favorite_post ON favorite_post.post_id = post.id
		LEFT JOIN user ON favorite_post.user_id = user.id
		WHERE post.id = ?`,
		[post_id],
		cb
	);
};

exports.search = (info, cb) => {
	connection.query(
		`SELECT * FROM view_post_img_detail
		WHERE CASE WHEN ? IS NOT NULL THEN main_category = ? ELSE 1=1 END
		AND CASE WHEN ? IS NOT NULL THEN sub_category = ? ELSE 1=1 END
		AND CASE WHEN ? IS NOT NULL THEN (LOWER(\`post_title\`) LIKE CONCAT('%' , ?, '%')
		OR LOWER(\`post_detail\`) LIKE CONCAT('%' , ?, '%')) ELSE 1=1 END
		AND date > now() - interval 30 day
		`,
		info,
		cb
	);
};

exports.update_user = (info, cb) => {
	connection.query(
		`UPDATE user SET avatar = ?, username = ? , phone_number = ? , street = ? , city = ?, province = ? , postcode = ?  WHERE id = ?`,
		info,
		cb
	);
};

exports.creat_chatroom = (info, cb) => {
	connection.query(`INSERT INTO user_chat_room SET ?`, info, cb);
};

exports.find_chatroom = (keypair, cb) => {
	connection.query(
		`select id from user_chat_room WHERE CONCAT(user_one,user_two) = ? or CONCAT(user_two,user_one) = ?`,
		[keypair, keypair],
		cb
	);
};

exports.insert_chat = (info, cb) => {
	connection.query(`INSERT INTO user_message SET ?`, info, cb);
};

exports.get_chat_room_by_user_id = (user_id, cb) => {
	connection.query(
		`select user_chat_room.id,
		JSON_ARRAYAGG(JSON_OBJECT('id', A.id ,'user', A.username, 'avatar', A.avatar, 'email', A.email)) AS user_one,
		JSON_ARRAYAGG(JSON_OBJECT('id', B.id ,'user', B.username, 'avatar', B.avatar, 'email', B.email)) AS user_two,
		view_chat_history.chat
		from user_chat_room
		JOIN user A ON A.id = user_chat_room.user_one
		JOIN user B ON B.id = user_chat_room.user_two
		JOIN view_chat_history on view_chat_history.room_id = user_chat_room.id
		where A.id = ? or B.id = ?
		GROUP BY user_chat_room.id;`,
		[user_id, user_id],
		cb
	);
};

exports.get_chat = (room_id, cb) => {
	connection.query(
		`select user_chat_room.id,
		JSON_ARRAYAGG(JSON_OBJECT('id', A.id ,'user', A.username, 'avatar', A.avatar, 'email', A.email)) AS user_one,
		JSON_ARRAYAGG(JSON_OBJECT('id', B.id ,'user', B.username, 'avatar', B.avatar, 'email', B.email)) AS user_two,
		view_chat_history.chat
		from user_chat_room
		JOIN user A ON A.id = user_chat_room.user_one
		JOIN user B ON B.id = user_chat_room.user_two
		JOIN view_chat_history on view_chat_history.room_id = user_chat_room.id
		WHERE user_chat_room.id = ?
		GROUP BY user_chat_room.id;`,
		[room_id],
		cb
	);
};

// connection.query(`select * from user`, (err, ros) => {
// 	console.log(ros);
// });
