module.exports = (db, auth_controller) => {
	const create_cookie = (req, res, id) => {
		db.get_user_by_id(id, (err, rows) => {
			console.log("setting cookie");
			if (err) {
				console.log(err.message);
			}
			const found_user = { ...rows[0] };
			const token = auth_controller.generateToken(found_user);
			res
				.cookie("jwt", token, {
					expires: new Date(Date.now() + 86400000),
					httpOnly: true,
				})
				.redirect("/content/home");
		});
	};

	return create_cookie;
};
