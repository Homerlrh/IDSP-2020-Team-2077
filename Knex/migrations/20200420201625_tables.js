exports.up = async (knex) => {
	return knex.schema
		.withSchema("craigslist")
		.dropTableIfExists("user")
		.dropTableIfExists("category")
		.dropTableIfExists("post")
		.dropTableIfExists("favorite_post")
		.dropTableIfExists("sub_category")
		.dropTableIfExists("image")
		.dropTableIfExists("comment")
		.createTable("user", (table) => {
			table.increments("id").primary();
			table
				.string("avatar")
				.defaultTo(
					"https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png"
				);
			table.string("username").notNullable();
			table.string("email").notNullable().unique();
			table.string("password").notNullable();
			table.string("phone_number").notNullable().defaultTo("000-0000000");
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
		.createTable("favorite_post", (table) => {
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
			table.unique(["user_id", "post_id"]);
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
				post.id AS post_id,
				post.title AS post_title,
				post.description AS post_detail,
				post.price AS price,
				post.condition AS item_condition,
				post.seller_id AS seller_id,
				post.category_id AS main_category,
				post.sub_category_id AS sub_category,
				CONCAT(post.area," ",post.province)AS location,
				post.created_at AS date,
				JSON_ARRAYAGG(image.img_url) As image
			FROM post JOIN image
				ON post.id = image.post_id
			GROUP BY post.id
			ORDER BY post.created_at;`
		)
		.raw(
			`CREATE OR REPLACE VIEW view_post_detail_user AS
				SELECT
					view_post_img_detail.*,
					JSON_OBJECT(
					'seller_avatar',user.avatar,	
					'seller_name', user.username,
					"seller_number",user.phone_number,
					"seller_email",user.email,
					"seller_adderss",CONCAT(
					user.street,',',
					user.city,',',
					user.province,',',
					user.postcode,',',
					user.country)
					) AS seller
				FROM view_post_img_detail
					LEFT JOIN user
					ON view_post_img_detail.seller_id = user.id
				GROUP BY view_post_img_detail.post_id
				ORDER BY view_post_img_detail.date;`
		)
		.raw(
			`CREATE OR REPLACE VIEW view_all_category AS
				SELECT category.type , 
				JSON_ARRAYAGG(sub_category.name) AS all_category
				FROM category 
				LEFT JOIN sub_category 
				ON category.id = sub_category.category_id
				GROUP BY category.id;`
		)
		.raw(
			`CREATE OR REPLACE VIEW view_user_favorite_post AS
			SELECT user.id, 
			JSON_ARRAYAGG(JSON_OBJECT(
				'post_id', view_post_img_detail.post_id,
				'post_title',view_post_img_detail.post_title,
				'price',view_post_img_detail.price,
				'condition',view_post_img_detail.item_condition,
				'location',view_post_img_detail.location,
				'date',view_post_img_detail.date,
				'image',view_post_img_detail.image
			)) AS favorite_post
			FROM user
			LEFT JOIN favorite_post ON user.id = user_id
			LEFT JOIN view_post_img_detail ON favorite_post.post_id = view_post_img_detail.post_id
			GROUP BY user.id
			`
		)
		.raw(
			`ALTER TABLE user
		CHANGE updated_at
		updated_at TIMESTAMP NOT NULL
						DEFAULT CURRENT_TIMESTAMP
						ON UPDATE CURRENT_TIMESTAMP`
		)
		.raw(
			`create table user_message (
				id INTEGER PRIMARY KEY AUTO_INCREMENT,
				send_user INTEGER UNSIGNED,
				recieve_user INTEGER UNSIGNED,
				line_chat VARCHAR(255),
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				FOREIGN KEY (send_user) REFERENCES user (id) ON DELETE SET NULL ON UPDATE RESTRICT,
				FOREIGN KEY (recieve_user) REFERENCES user (id) ON DELETE SET NULL ON UPDATE RESTRICT
			);`
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
