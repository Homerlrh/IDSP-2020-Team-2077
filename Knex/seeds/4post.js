exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("post")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("post").insert([
				{
					title: "I am selling the house",
					description:
						"I am done with this house i want to sell it now. If interested, contact me for more info",
					price: "25,000,000.0",
					seller_id: 1,
					area: "Vancouver",
					province: "BC",
					category_id: 1,
					sub_category_id: 1,
				},
				{
					title: "I am selling the house",
					description:
						"I am done with this house i want to sell it now. If interested, contact me for more info",
					price: "25,000,000.0",
					seller_id: 2,
					area: "Richmond",
					province: "BC",
					category_id: 1,
					sub_category_id: 1,
				},
				{
					title: "I want to rent a house near kingsway",
					description: "I am just arrive in Vancouver, I need a place to sleep",
					price: "25,000,000.0",
					seller_id: 3,
					area: "Vancouver",
					province: "BC",
					category_id: 1,
					sub_category_id: 2,
				},
				{
					title: "This house is for party (CAD 200 / night)",
					description:
						"I am done with this house i want to sell it now. If interested, contact me for more info",
					price: "200.0",
					seller_id: 1,
					area: "Surrey",
					province: "BC",
					category_id: 1,
					sub_category_id: 5,
				},
			]);
		});
};
