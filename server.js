try {
	require("dotenv").config();
} catch (Error) {
	null;
}
const http = require("http");
const db = require("./database/DB");
const passport = require("./passport/passport");
const app = require("./app")(db, passport);
const server = http.createServer(app);
const port = process.env.PORT || 3333;
const io = require("socket.io")(server);

server.listen(port, () => {
	console.log(`server running at http://localhost:${port}`);
});

io.on("connection", (socket) => {
	socket.on("join_chat", (room) => {
		socket.join(room);
		socket.to(room).broadcast.emit("join_chat", "online");
	});
	socket.on("send-msg", (room, msg) => {
		socket.to(room).broadcast.emit("send-msg", msg);
	});
	socket.on("leave_chat", (room) => {
		socket.to(room).broadcast.emit("leave_chat", "offline");
	});
});
