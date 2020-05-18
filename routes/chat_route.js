const express = require("express");
const router = express.Router();

module.exports = (db) => {
	function get_other_user(data, user) {
		return data.map((x) => {
			if (x.user_one.includes(`"id": ${user}`)) {
				delete x.user_one;
				x.other_user = x.user_two;
				delete x.user_two;
				return x;
			}
			if (x.user_two.includes(`"id": ${user}`)) {
				delete x.user_two;
				x.other_user = x.user_one;
				delete x.user_one;
				return x;
			}
		});
	}

	router.get("/", (req, res) => {
		const user = { ...req.user }.id;
		db.get_chat_room_by_user_id(user, async (err, row) => {
			err
				? res.send(err)
				: res.render("account/message", {
						chatrooms: get_other_user(row, user),
						content_css: " ",
						footer: false,
						d_sidebar: false,
				  });
		});
	});

	router.get("/detail_msg/:room_id", (req, res) => {
		const user = { ...req.user }.id;
		db.get_chat(req.params.room_id, (err, rows) => {
			const mod = get_other_user(rows, user);
			err
				? res.send(err)
				: res.render("account/detail_chat", {
						user: req.user,
						id: mod[0].id,
						user_two: JSON.parse(mod[0].other_user)[0],
						chat: JSON.parse(mod[0].chat),
						content_css: " ",
						footer: false,
						d_sidebar: false,
						socket: true,
				  });
		});
	});

	return router;
};
