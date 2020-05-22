//filter current user information
//pass the row and also user id
function get_other_user(data, user) {
	return data.map((x) => {
		if (x.user_one.includes(`"id": ${user}`)) {
			delete x.user_one;
			x.other_user = x.user_two;
			delete x.user_two;
			return x;
		}
		if (x.user_two.includes(`"id": ${user}`)) {
			delete x.user_two;
			x.other_user = x.user_one;
			delete x.user_one;
			return x;
		}
	});
}

module.exports = { get_other_user };
