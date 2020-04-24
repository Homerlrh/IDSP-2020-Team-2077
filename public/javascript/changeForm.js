const bth = $("#toggle_btn");

bth.on("click", (e) => {
	e.preventDefault();
	console.log("oh you clicked me");
	$(".inner").hide();
	$(".inner2").css("display", "flex");
});
