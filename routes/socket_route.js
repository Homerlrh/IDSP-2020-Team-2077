module.exports = (db, io) => {
	io.on("connection", (socket) => {
		socket.on("join_chat", (room) => {
			socket.join(room);
			socket.to(room).broadcast.emit("join_chat", "online");
		});
		socket.on("send-msg", (room, msg) => {
			const info = { chat_room_id: room, ...msg };
			db.insert_chat(info, (err, result) => {
				err ? console.log(err) : console.log(result.insertId);
			});
			socket.to(room).broadcast.emit("send-msg", msg);
		});
		socket.on("leave_chat", (room) => {
			socket.to(room).broadcast.emit("leave_chat", "offline");
		});
	});

	return io;
};
