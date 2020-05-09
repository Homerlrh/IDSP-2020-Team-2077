const fav = document.querySelector("#fav-btn");

function like(input, color, like) {
	input.css("color", color);
	const url = $("#fav-frm").attr("action");
	console.log(url);
	$.ajax({
		type: "post",
		url: url,
		data: { state: like },
		success: function (response) {
			alert(response);
		},
		error: function (err) {
			alert(err);
		},
	});
}

fav.addEventListener("click", function (e) {
	e.preventDefault();
	let btn_color = $("#fav-btn").css("color");
	btn_color == "rgb(255, 0, 0)"
		? like($(this), "black", "unlike")
		: like($(this), "red", "like");
});
