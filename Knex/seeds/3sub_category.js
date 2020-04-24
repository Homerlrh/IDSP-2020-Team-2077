exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex("sub_category")
		.del()
		.then(function () {
			// Inserts seed entries
			return knex("sub_category").insert([
				{ name: "buy", category_id: 1 },
				{ name: "rent", category_id: 1 },
				{ name: "office", category_id: 1 },
				{ name: "storage", category_id: 1 },
				{ name: "vacation", category_id: 1 },
				{ name: "rooms", category_id: 1 },
				{ name: "new", category_id: 2 },
				{ name: "used", category_id: 2 },
				{ name: "modified", category_id: 2 },
				{ name: "rebuilt", category_id: 2 },
				{ name: "salvage", category_id: 2 },
				{ name: "parts", category_id: 2 },
				{ name: "mobile", category_id: 3 },
				{ name: "desktop/laptop", category_id: 3 },
				{ name: "audio/video", category_id: 3 },
				{ name: "gaming", category_id: 3 },
				{ name: "smart_devices", category_id: 3 },
				{ name: "other/accessories", category_id: 3 },
				{ name: "full_time", category_id: 4 },
				{ name: "part_time", category_id: 4 },
				{ name: "contract", category_id: 4 },
				{ name: "temporary", category_id: 4 },
				{ name: "informal/on_call", category_id: 4 },
				{ name: "seasonal", category_id: 4 },
				{ name: "home/garden", category_id: 5 },
				{ name: "fun/recreation", category_id: 5 },
				{ name: "fashion/apparel", category_id: 5 },
				{ name: "sports/outdoor", category_id: 5 },
				{ name: "arts/stationary", category_id: 5 },
				{ name: "tv/appliances", category_id: 5 },
				{ name: "activities/events", category_id: 6 },
				{ name: "child_care", category_id: 6 },
				{ name: "volunteer_opportunities", category_id: 6 },
				{ name: "community_services", category_id: 6 },
				{ name: "classes", category_id: 6 },
				{ name: "groups", category_id: 6 },
			]);
		});
};
