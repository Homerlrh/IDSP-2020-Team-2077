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
		$("body").css("overflow", "auto");
	}
};

$(function () {
	$("#confirm_chat").dialog({
		autoOpen: false,
		show: {
			duration: 1000,
		},
		hide: {
			duration: 1000,
		},
		modal: true,
		position: {
			my: "center",
			at: "center",
			of: $(".myModal"),
		},
		buttons: {
			Done: function () {
				$(this).dialog("close");
				$(".myModal").hide();
				$("body").css("overflow", "auto");
			},
		},
	});
});

const frm = document.querySelector("#post_chatForm");
const chat_input = document.querySelector("#chatinput");

frm.addEventListener("submit", (e) => {
	e.preventDefault();
	if (chat_input.value.trim() != "") {
		$.ajax({
			type: "post",
			url: "/chat/start_chat",
			data: $(frm).serialize(),
			success: function (response) {
				$("#confirm_chat").dialog("open");
			},
			error: function (err) {
				alert(
					`Opps something went wrong in the server side, please try again later, err: ${err.message}`
				);
			},
		});
	}
});
