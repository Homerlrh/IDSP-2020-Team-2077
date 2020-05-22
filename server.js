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
require("./routes/socket_route")(db, io);

server.listen(port, () => {
	console.log(`server running at http://localhost:${port}`);
});
