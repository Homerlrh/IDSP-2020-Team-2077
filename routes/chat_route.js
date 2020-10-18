const express = require("express");
const router = express.Router();
const filter = require("./helper_function/filter_user").get_other_user;

module.exports = (db) => {
	router.get("/", (req, res) => {
		const user = { ...req.user }.id;
		db.get_chat_room_by_user_id(user, (err, row) => {
			if (err) {
				return res.send(err);
			}
			res.render("newDesign/newChatInterface", {
				err: req.flash("message"),
				chatrooms: filter(row, user),
				content_css: " ",
				footer: false,
				d_sidebar: false,
			});
		});
	});

	router.get("/detail_msg/:room_id", (req, res) => {
		const user = { ...req.user }.id;
		const room = req.params.room_id;
		db.get_chat(room, (err, rows) => {
			try {
				const modify = filter(rows, user);
				if (err) {
					return res.send(err);
				}
				res.render("account/detail_chat", {
					user: req.user,
					id: modify[0].id,
					user_two: JSON.parse(modify[0].other_user)[0],
					chat: JSON.parse(modify[0].chat),
					content_css: " ",
					footer: false,
					d_sidebar: false,
				});
			} catch (err) {
				req.flash("message", "That is not your chatroom");
				res.redirect("/chat/");
			}
		});
	});

	router.get("/detail_msg/ci/:room_id", (req, res) => {
		const user = { ...req.user }.id;
		const room = req.params.room_id;
		db.get_chat(room, (err, rows) => {
			try {
				const modify = filter(rows, user);
				if (err) {
					return res.send(err);
				}
				res.send({
					user: req.user,
					id: modify[0].id,
					user_two: JSON.parse(modify[0].other_user)[0],
					chat: JSON.parse(modify[0].chat),
					content_css: " ",
					footer: false,
					d_sidebar: false,
				});
			} catch (err) {
				req.flash("message", "That is not your chatroom");
				res.redirect("/chat/");
			}
		});
	});

	function insert_chat(room_id, user_one, user_two, chat) {
		db.insert_chat(
			{
				chat_room_id: room_id,
				send_user: user_one,
				receive_user: user_two,
				line_chat: chat,
			},
			(err, result) => {
				err ? console.log(err) : console.log(result);
			}
		);
	}

	router.post("/start_chat", (req, res) => {
		const { user_two, msg } = { ...req.body };
		const current_user = req.user.id;
		db.get_user_id_by_email(user_two, (err, id) => {
			const other_user = id[0].id;
			if (err) {
				return res.send("server error, please try again later");
			}
			db.creat_chatroom(
				{ user_one: current_user, user_two: other_user },
				(err, result) => {
					const keypair = `${String(current_user)},${String(other_user)}`;
					if (err) {
						db.find_chatroom(keypair, (err, row) => {
							const room = row[0].id;

							if (err) {
								return res.send("server error, please try again later");
							}
							insert_chat(room, current_user, other_user, msg);
						});
						return;
					}
					insert_chat(result.insertId, current_user, other_user, msg);
				}
			);
		});
		res.send("message is being sent");
	});

	return router;
};
