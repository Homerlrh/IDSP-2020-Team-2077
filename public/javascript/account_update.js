$("#avatar").on("click", function () {
	$("input[name='avatar']").click();
	console.log("hi");
});

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$("#avatar").attr("src", e.target.result);
		};

		reader.readAsDataURL(input.files[0]); // convert to base64 string
	}
}

$("input[name='avatar']").change(function () {
	readURL(this);
});

$("#user_update").submit(function (e) {
	e.preventDefault();

	const formData = new FormData($(this)[0]);
	$.ajax({
		url: "/user/setting",
		type: "POST",
		data: formData,
		async: false,
		success: function (data) {
			alert(data);
		},
		cache: false,
		contentType: false,
		processData: false,
	});

	return false;
});

$("#confirm_update").click(() => {
	$("#close-btn").click();
});
