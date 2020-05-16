const modal = document.querySelector(".myModal");

$("#contact").on("click", () => {
	$(".myModal").show();
	$("body").css("overflow", "hidden");
});

$(".close").on("click", () => {
	$(".myModal").hide();
	$("body").css("overflow", "auto");
});

window.onclick = function (event) {
	if (event.target == modal) {
		modal.style.display = "none";
	}
};

const socket = io("http://localhost:3333");
const msg_frm = document.querySelector("#chatForm");
const msg_inp = document.querySelector("#chatinput");
const chat_interface = document.querySelector("#chatbody");

socket.on("chat-message", (data) => {
	console.log(data);
});

msg_frm.addEventListener("submit", (e) => {
	e.preventDefault();
	const msg = msg_inp.value;
	console.log(msg);
	socket.emit("send-msg", msg);
	msg_inp.value = " ";
	append_message(msg);
});

function append_message(msg) {
	const li = document.createElement("li");
	li.innerHTML = msg;
	chat_interface.append(li);
	updateScroll();
}

function updateScroll() {
	const element = document.getElementById("chatbody");
	element.scrollTop = element.scrollHeight;
}
