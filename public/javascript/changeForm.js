const bth = $("#toggle_btn");

$(function () {
	$("#frm_validate").dialog({
		autoOpen: false,
		show: {
			effect: "bounce",
			duration: 1000,
		},
		hide: {
			duration: 1000,
		},
		modal: true,
		position: {
			my: "center",
			at: "center",
			of: $(".inner"),
		},
		buttons: {
			Fix: function () {
				$(this).dialog("close");
			},
		},
	});
});

bth.on("click", (e) => {
	e.preventDefault();

	//email validation
	const c_em = document.querySelector("label[for='email']:first-child")
		.className;

	//password validation
	const pw_c = document.querySelector("label[for='password']:first-child")
		.className;

	//confirm password
	const c_pw = document.querySelector(
		"label[for='Confirm_Password']:first-child"
	).className;
	const username = document.querySelector("#Username").value;
	console.log("oh you clicked sign up");
	if (
		c_em == "invalid" ||
		c_em == "" ||
		pw_c == "invalid" ||
		pw_c == "" ||
		c_pw == "invalid" ||
		c_pw == "" ||
		username == ""
	) {
		$("#frm_validate").dialog("open");
	} else {
		$(".inner").hide();
		$(".inner2").css("display", "flex");
	}
});

const cont_bth = $("#continue_btn");

cont_bth.on("click", (e) => {
	e.preventDefault();
	console.log("oh you clicked continue");
	$(".inner2").hide();
	$(".inner3").css("display", "flex");
});

const term_btn = $("#term_btn");

term_btn.on("click", (e) => {
	e.preventDefault();
	console.log("oh you clicked term");
	if ($("#confirm_agree").is(":checked")) {
		$(".logo1").hide();
		$(".inner3").hide();
		$(".inner4").css("display", "flex");
		return;
	}
	$("#term_btn").effect("shake", { direction: "up" });
});

// $("#err_msg").change((e) => {
// 	e.preventDefault();
// 	console.log("hi");
// });

const sub_category = {
	1: ["Buy", "Rent", "Office", "Storage", "Vacation", "Rooms"],
	2: ["New", "Used", "Modified", "Rebuilt", "Salvage", "Parts"],
	3: [
		"Mobile",
		"Desktop / Laptop",
		"Audio / Video",
		"Gaming",
		"Smart Devices",
		"Other / Accessories",
	],
	4: [
		"Home / Garden",
		"Fun / Recreation",
		"Fashion / Apparel",
		"Sports / Outdoor",
		"Arts / Stationary",
		"TV / Appliances",
	],
	5: [
		"Full Time",
		"Part Time",
		"Contract",
		"Temporary",
		"Informal / On Call",
		"Seasonal",
	],
	6: [
		"Activities / Events",
		"Child Care",
		"Volunteer Opportunities",
		"Community Services",
		"Classes",
		"Groups",
	],
};

$("#Category").on("change", (e) => {
	e.preventDefault();
	const sub_group = $("#Category").val();
	$("#Sub-Category").empty();
	//change value in sub category checkbox according to category
	sub_category[sub_group].forEach((x, index) => {
		$("#Sub-Category").append(
			`<option alt="${x}" value="${index + 1}">${x}</option>`
		);
	});
});
