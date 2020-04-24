exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("comment")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("comment").insert([
				{ user_id: 1, post_id: 1, rating: 4, description: "i dont like this" },
			]);
		});
};
