function custom_validation(input) {
	this.invalid = [];
	this.check_validity = [];
	this.input = input;
	this.init_listener();
}

const class_change = (bool, requirement, label) => {
	if (bool) {
		$(label).switchClass("valid", "invalid");
		$(requirement).switchClass("valid", "invalid");
		return;
	}
	$(label).switchClass("invalid", "valid");
	$(requirement).switchClass("invalid", "valid");
};

custom_validation.prototype = {
	addInvalidClass: function (msg) {
		this.invalid.push(msg);
	},
	check_validate: function (input) {
		for (let i = 0; i < this.check_validity.length; i++) {
			const item = this.check_validity[i];
			let is_invalid = item.is_invalid(input);
			if (is_invalid) {
				this.addInvalidClass(item.msg);
			}

			const requirement = item.element;
			const label = item.label;
			class_change(is_invalid, requirement, label);
		}
	},
	check_input: function () {
		this.check_validate(this.input);
	},
	init_listener: function () {
		//register the listener here
		let run_validation = this;
		this.input.addEventListener("keyup", function () {
			run_validation.check_input();
		});
	},
};

const email_validate = [
	{
		is_invalid: function (input) {
			return !input.value.match(
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
		},
		element: document.querySelector("li[for='email']:first-child"),
		label: document.querySelector("label[for='email']:first-child"),
	},
];

const password_validate = [
	{
		is_invalid: function (input) {
			return input.value.length < 6;
		},
		element: document.querySelector("li[for='password']:nth-child(1)"),
		label: document.querySelector("label[for='password']:first-child"),
	},
	{
		is_invalid: function (input) {
			return !input.value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/);
		},
		element: document.querySelector("li[for='password']:nth-child(2)"),
		label: document.querySelector("label[for='password']:first-child"),
	},
	{
		is_invalid: function (input) {
			return !input.value.match(/\d/);
		},
		element: document.querySelector("li[for='password']:nth-child(3)"),
		label: document.querySelector("label[for='password']:first-child"),
	},
];

const confirm_password = [
	{
		is_invalid: function (input) {
			return input.value != password_input.value;
		},
		element: document.querySelector("li[for='Confirm_Password']:first-child"),
		label: document.querySelector("label[for='Confirm_Password']:first-child"),
	},
];

// event listener

const email_input = document.querySelector("#email");
email_input.custom_validation = new custom_validation(email_input);
email_input.custom_validation.check_validity = email_validate;

const password_input = document.querySelector("#password");
password_input.custom_validation = new custom_validation(password_input);
password_input.custom_validation.check_validity = password_validate;

const password_confirm = document.querySelector("#Confirm_Password");
password_confirm.custom_validation = new custom_validation(password_confirm);
password_confirm.custom_validation.check_validity = confirm_password;
