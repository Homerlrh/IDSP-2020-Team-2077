$("#sidebar-toggle").on("click", () => {
	if ($(".side_nav_bar").css("max-width") == "300px") {
		$("#overlay").hide();
		$(".side_nav_bar").css("max-width", "0");
		return;
	}
	$("#overlay").show();
	$("#sidebar-toggle").css("z-index", "2");
	$(".side_nav_bar").css("max-width", "300px");
});
