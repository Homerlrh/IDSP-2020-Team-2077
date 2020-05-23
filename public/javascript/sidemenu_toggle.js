$(document).ready(function () {
	$("#sidebar-toggle").on("click", () => {
		if ($(".side_nav_bar").css("max-width") == "300px") {
			$("#overlay").hide();
			$(".side_nav_bar").css("max-width", "0");
			$("body").css("overflow", "auto");
			return;
		}
		$("#overlay").show();
		$("#sidebar-toggle").css("z-index", "2");
		$(".side_nav_bar").css("max-width", "300px");
		$("body").css("overflow", "hidden");
	});

	$("#overlay").click(() => {
		$("#overlay").hide();
		$(".side_nav_bar").css("max-width", "0");
		$("body").css("overflow", "auto");
		return;
	});

	if ($(window).width() < 995) {
		$(".go_btn").css("pointer-events", "unset");
		return;
	}
	$(".go_btn").css("pointer-events", "none");
});
