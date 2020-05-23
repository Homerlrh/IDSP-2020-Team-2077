const socket = io("https://idsp-craigslist-redesign.herokuapp.com/");

//get the form data from DOM element
const msg_frm = document.querySelector("#chatForm");
const msg_inp = document.querySelector("#chatinput");
const chat_interface = document.querySelector("#chatbody");
const room = document.querySelector("#room");
const status = document.querySelector("#status");

//get the both user's user information
const user_one = document.querySelector("#send_user");
const user_two = document.querySelector("#to_user");
const user_one_avatar = document.querySelector("#user_one_avatar");
const user_two_avatar = document.querySelector("#user_two_avatar");

//private message
if (msg_frm != null) {
	//join the chat room once the page is loaded
	socket.emit("join_chat", room.value);

	//submit user data
	msg_frm.addEventListener("submit", (e) => {
		e.preventDefault();
		const msg = msg_inp.value;
		const send_user = user_one.value;
		const to_user = user_two.value;
		const chatroom = room.value;
		//only submit message when from is not empty
		if (msg.trim() != "") {
			socket.emit("send-msg", chatroom, {
				send_user: send_user,
				line_chat: msg,
				receive_user: to_user,
			});
			append_message({ send_user: user_one_avatar.value, line_chat: msg });
			msg_inp.value = "";
		} else {
			alert("chatbox can not be empty");
		}
	});
}

socket.on("send-msg", (data) => {
	data.send_user = user_two_avatar.value;
	append_message(data);
});

//other user status
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
	li.style.textAlign = msg.receive_user ? "left" : "right";

	const span = document.createElement("span");
	msg.receive_user ? span.classList.add("receive") : span.classList.add("send");
	span.innerHTML = msg.line_chat;

	const img = document.createElement("img");
	img.classList.add("chat_avatar");
	img.src = msg.send_user;
	if (msg.receive_user) {
		li.appendChild(img);
		li.appendChild(span);
	} else {
		li.appendChild(span);
		li.appendChild(img);
	}
	chat_interface.appendChild(li);
	updateScroll();
}

function updateScroll() {
	const element = document.querySelector("#chatbody");
	element.scrollTop = element.scrollHeight;
}
