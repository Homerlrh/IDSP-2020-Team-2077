$("#photo_upload").on("click", () => {
	$("input[name='pic']").click();
});

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$("#preview_img").attr("src", e.target.result);
		};

		reader.readAsDataURL(input.files[0]); // convert to base64 string
	}
}

$("#imgInp").change(function () {
	readURL(this);
});

function add_preview(input) {
	document.querySelector(`#${input}`).addEventListener("keyup", (e) => {
		e.preventDefault();
		document.querySelector(
			`#preview_${input}`
		).innerHTML = document.querySelector(`#${input}`).value;
	});
}

add_preview("Title");
add_preview("Price");
add_preview("Description");

$("#preview").click((e) => {
	e.preventDefault();
	const c_parent = $("#Category option:selected").text();
	const c_children = $("#Sub-Category option:selected").text();
	document.querySelector("#category").innerHTML = `${c_children} ${c_parent}`;
	const l_parent = $("#province option:selected").text();
	const l_children = $("#city option:selected").text();
	document.querySelector("#location").innerHTML = `${l_children} > ${l_parent}`;
	$("#fill_post").hide();
	$("#preview_section").css("display", "grid");
});

$("#edit-btn").click((e) => {
	e.preventDefault();
	$("#fill_post").show();
	$("#preview_section").hide();
});

function check_empty(input) {
	const input_field = document.querySelector(`#${input}`).value;
	if (!input_field.trim().length > 0) {
		return false;
	}
	return true;
}

$("#publish-btn").click((e) => {
	e.preventDefault();
	let is_empty = true;
	["Title", "Price", "Description"].forEach((x) => {
		is_empty = check_empty(x);
	});
	if (!is_empty) {
		console.log(is_empty);

		$("#publish-btn").effect("shake", { direction: "up" });
		return;
	}
	$("#create_post").submit();
});
