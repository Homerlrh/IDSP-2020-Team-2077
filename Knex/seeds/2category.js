exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("category")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("category").insert([
				{ type: "housing" },
				{ type: "vehicles" },
				{ type: "electronics" },
				{ type: "jobs" },
				{ type: "for_sale" },
				{ type: "community" },
			]);
		});
};
