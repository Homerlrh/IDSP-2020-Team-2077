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
	// socket.emit("chat-message", "hello world");
	console.log(socket.id);
	socket.on("send-msg", (msg_inp) => {
		console.log(msg_inp);
	});
});
app.get("/chat/", (req, res) => {
	io.emit("chat-message", "hello world");
	res.render("account/message", {
		content_css: " ",
		footer: false,
		d_sidebar: false,
	});
});

app.get("/chat/detail_msg", (req, res) => {
	res.render("account/detail_chat", {
		content_css: " ",
		footer: false,
		d_sidebar: false,
	});
});
app.post("/chat/msg", (req, res) => {});
