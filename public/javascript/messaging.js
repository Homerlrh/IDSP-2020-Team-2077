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
