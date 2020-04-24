exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("image")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("image").insert([
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 1,
				},
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 1,
				},
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 3,
				},
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 4,
				},
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 4,
				},
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 1,
				},
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 2,
				},
				{
					img_url: "https://i.ibb.co/gVvjDpP/IMG-3836.jpg",
					post_id: 1,
				},
			]);
		});
};
