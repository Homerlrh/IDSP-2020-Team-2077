const btm_nav = document.querySelectorAll(".bottom_nav");

btm_nav.forEach((btn, index) => {
	$(btn).on("click", (e) => {
		e.preventDefault();
		const url = btn.getAttribute("endpoint");
		$.ajax({
			type: "get",
			url: url,
			success: function (response) {
				$(".content_box").html($(response).find(".content_box *"));
			},
			error: function (err) {
				alert(
					`Opps something went wrong in the server side, please try again later, err: ${err.message}`
				);
			},
		});
	});
});
