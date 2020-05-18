const socket = io("http://localhost:3333");
const msg_frm = document.querySelector("#chatForm");
const msg_inp = document.querySelector("#chatinput");
const username = document.querySelector("#username");
const chat_interface = document.querySelector("#chatbody");
const room = document.querySelector("#room");
const all_room = document.querySelectorAll(".single-anchor");
const status = document.querySelector("#status");

if (msg_frm != null) {
	socket.emit("join_chat", room.value);

	msg_frm.addEventListener("submit", (e) => {
		e.preventDefault();
		const msg = msg_inp.value;
		if (msg.trim() != "") {
			const user = username.value;
			const chatroom = room.value;
			socket.emit("send-msg", chatroom, {
				user: user,
				message: msg,
			});
			append_message({ user: "you", message: msg });
			msg_inp.value = "";
		} else {
			alert("chatbox can not be empty");
		}
	});
}

socket.on("send-msg", (data) => {
	append_message(data);
});

socket.on("join_chat", (data) => {
	toggle_color(data, status);
});

socket.on("leave_chat", (data) => {
	toggle_color(data, status);
});

window.onbeforeunload = function () {
	socket.emit("leave_chat", room.value);
};

function toggle_color(data, input) {
	input.innerHTML = `( ${data} )`;
	input.style.color = "red" ? "green" : "red";
}

function append_message(msg) {
	const li = document.createElement("li");
	li.innerHTML = `${msg.user}: ${msg.message}`;
	chat_interface.append(li);
	updateScroll();
}

function updateScroll() {
	const element = document.getElementById("chatbody");
	element.scrollTop = element.scrollHeight;
}
