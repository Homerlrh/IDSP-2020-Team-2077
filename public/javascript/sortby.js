const all_post = document.querySelectorAll(".single-anchor");
function is_hidden(input) {
	return $(input).css("display") == "none" ? true : false;
}

let s1 = "";
let s2 = "";
let s3 = "";

$("#sort_by").change(function () {
	s1 = $(this).children("option:selected").val();
	console.log(s1, s2, s3);
	all_post.forEach(function (x) {
		if (is_hidden(x)) {
			$(x).hide();
		}
		const condition = x
			.querySelector(".single_post")
			.querySelector(".condition").innerHTML;
		s1 == "All" ? $(x).show() : condition != s1 ? $(x).hide() : $(x).show();
	});
});

$("#d-filter-cost").change(function () {
	s2 = $(this).children("option:selected").val();
	console.log(s1, s2, s3);
	const range = s2.split("~");
	all_post.forEach(function (x) {
		if (is_hidden(x)) {
			$(x).hide();
		}
		const cost = x
			.querySelector(".single_post")
			.querySelector(".price")
			.innerHTML.split("$")[1]
			.split(".")[0]
			.split(",")
			.join("");
		if (Number(cost) > 2000000 && range[0] == "2000000") {
			$(x).show();
			return;
		}
		s2 == "All"
			? $(x).show()
			: Number(range[0]) > Number(cost) > Number(range[1])
			? $(x).show()
			: $(x).hide();
	});
});

$("#d-filter-c").change(function () {
	s3 = $(this).children("option:selected").val();
	console.log(s1, s2, s3);
	Array.from(all_post).filter((x) => {
		if (s3 == "All") {
			return $(x).show();
		}
		const location = x.querySelector(".single_post").querySelector(".location")
			.innerHTML;

		return location.includes(s3) ? $(x).show() : $(x).hide();
	});
});
