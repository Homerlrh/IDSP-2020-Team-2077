exports.up = async (knex) => {
	return knex.schema
		.withSchema("craigslist")
		.createTable("user", (table) => {
			table.increments("id").primary();
			table.string("username").notNullable();
			table.string("email").notNullable().unique();
			table.string("password").notNullable();
			table.integer("phone_number").notNullable().defaultTo(0000000000);
			table.string("house_number").notNullable();
			table.string("street").notNullable();
			table.string("city").notNullable();
			table.string("province").notNullable();
			table.string("postcode").notNullable().defaultTo("ABCCBA");
			table.string("country").notNullable().defaultTo("Canada");
			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.timestamp("updated_at").defaultTo(knex.fn.now());
		})
		.createTable("category", (table) => {
			table.increments("id").primary();
			table.string("type").notNullable();
		})
		.createTable("sub_category", (table) => {
			table.increments("id").primary();
			table.string("name").defaultTo("");
			table
				.integer("category_id")
				.unsigned()
				.references("category.id")
				.onDelete("SET NULL")
				.onUpdate("RESTRICT");
		})
		.createTable("post", (table) => {
			table.increments("id").primary();
			table.string("title").notNullable();
			table.string("description");
			table.string("price").notNullable();
			table.string("condition").defaultTo("n/a");
			table.string("area").notNullable();
			table.string("province").notNullable();
			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.timestamp("updated_at").defaultTo(knex.fn.now());
			table
				.integer("seller_id")
				.unsigned()
				.references("user.id")
				.onDelete("SET NULL")
				.onUpdate("RESTRICT");
			table
				.integer("category_id")
				.unsigned()
				.references("sub_category.category_id")
				.onDelete("SET NULL")
				.onUpdate("RESTRICT");
			table
				.integer("sub_category_id")
				.unsigned()
				.references("sub_category.id")
				.onDelete("SET NULL")
				.onUpdate("RESTRICT");
		})
		.createTable("image", (table) => {
			table.increments("id").primary();
			table
				.string("img_url")
				.notNullable()
				.defaultTo(
					"https://cdn2.iconfinder.com/data/icons/freecns-cumulus/16/519660-164_QuestionMark-512.png"
				);
			table
				.integer("post_id")
				.unsigned()
				.references("post.id")
				.onDelete("SET NULL")
				.onUpdate("RESTRICT");
		})
		.createTable("comment", (table) => {
			table.increments("id").primary();
			table
				.integer("user_id")
				.unsigned()
				.references("user.id")
				.onDelete("SET NULL")
				.onUpdate("RESTRICT");
			table
				.integer("post_id")
				.unsigned()
				.references("post.id")
				.onDelete("SET NULL")
				.onUpdate("RESTRICT");
			table.integer("rating").defaultTo(5);
			table.string("description").notNullable();
			table.timestamp("created_at").defaultTo(knex.fn.now());
			table.timestamp("updated_at").defaultTo(knex.fn.now());
		})
		.raw(
			`CREATE OR REPLACE VIEW view_post_img_detail AS
			SELECT
				post.id,
				post.title,
				post.description,
				post.price,
				post.condition,
				post.seller_id,
				post.category_id,
				post.sub_category_id,
				JSON_ARRAYAGG(image.img_url)
			FROM post JOIN image
				ON post.id = image.post_id
			GROUP BY post.id;`
		)
		.raw(
			`CREATE OR REPLACE VIEW view_post_detail_user AS
			SELECT
				view_post_img_detail.*,
				JSON_ARRAYAGG(JSON_OBJECT(
				'seller_name', user.username,
				"seller_number",user.phone_number,
				"seller_email",user.email,
				"seller_adderss",CONCAT(
				user.house_number,',',
				user.street,',',
				user.city,',',
				user.province,',',
				user.postcode,',',
				user.country)
				)) AS seller
			FROM view_post_img_detail
				LEFT JOIN user
				ON view_post_img_detail.seller_id = user.id
			GROUP BY view_post_img_detail.id;`
		)
		.then(console.log("table created"));
};

exports.down = async (knex) => {
	await knex.raw(`SET FOREIGN_KEY_CHECKS=0;`);
	await knex.schema.withSchema("craiglist").dropTableIfExists("user");
	await knex.schema.withSchema("craiglist").dropTableIfExists("category");
	await knex.schema.withSchema("craiglist").dropTableIfExists("post");
	await knex.schema.withSchema("craiglist").dropTableIfExists("sub_category");
	await knex.schema.withSchema("craiglist").dropTableIfExists("image");
	await knex.schema.withSchema("craiglist").dropTableIfExists("comment");
	await knex.raw(`SET FOREIGN_KEY_CHECKS=1;`);
};
