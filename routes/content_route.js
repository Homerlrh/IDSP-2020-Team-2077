const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

module.exports = (db) => {
	router.get("/home", (req, res) => {
		db.get_category((err, rows) => {
			if (err) {
				return console.log(err);
			}
			res.render("content/home", {
				content_css: "/css/content.css",
				categories: [...rows],
				is_login: req.cookies["jwt"] ? true : false,
				filter: false,
			});
		});
	});

	router.get("/category/:type", (req, res) => {
		const type = req.params.type.toLocaleLowerCase().replace(" ", "_");
		db.get_category_id(type, (err, rows) => {
			if (err) {
				return console.log(err.message);
			}
			const category_id = rows[0].id;
			db.get_subcategory(category_id, (err, rows) => {
				if (err) {
					return console.log(err.message);
				}
				const sub_category = [...rows];
				res.send(sub_category);
			});
		});
	});

	router.get("/sidemenu/:type", (req, res) => {
		const type = req.params.type;
		db.get_category_id(type, (err, rows) => {
			if (err) {
				return console.log(err.message);
			}
			const category_id = rows[0].id;
			db.get_subcategory(category_id, (err, rows) => {
				if (err) {
					return console.log(err.message);
				}
				const sub_category = [...rows];
				res.render("content/home", {
					content_css: "/css/content.css",
					sub_categories: sub_category,
					is_login: req.cookies["jwt"] ? true : false,
					type: type,
					id: category_id,
				});
			});
		});
	});

	//get data from db according the params in the url
	router.get(
		"/:type/:category/sub_category/:sub_type/:sub_category",
		(req, res) => {
			const { type, category, sub_type, sub_category } = req.params;
			get_allpost(req, res, sub_type, category, sub_category);
		}
	);
	//get all the post by category
	router.get("/ql/:type/:c_id", (req, res) => {
		const { type, c_id } = req.params;
		get_allpost(req, res, type, c_id, null);
	});

	router.get("/post_detail/:post_id", auth_token, (req, res) => {
		const id = req.params.post_id;
		db.get_post_detail(id, (err, rows) => {
			db.detect_likes(id, (err, like) => {
				let is_liked =
					req.user != null
						? JSON.parse(like[0].liked_user).includes(req.user.id)
						: false;
				return err
					? console.log(err)
					: res.render("content/detailpost", {
							id: id,
							seller: JSON.parse({ ...rows[0] }.seller),
							picture: JSON.parse({ ...rows[0] }.image),
							post: { ...rows[0] },
							content_css: " ",
							is_login: req.cookies["jwt"] ? true : false,
							footer: false,
							is_liked: is_liked,
							img: true,
							d_sidebar: false,
					  });
			});
		});
	});

	router.post("/search", (req, res) => {
		let { query, category_id, sub_category_id } = req.body;
		category_id = category_id == 0 ? null : category_id;
		sub_category_id = isNaN(sub_category_id) ? null : sub_category_id;
		query = query.trim().length > 0 ? query : null;
		db.search(
			[
				category_id,
				category_id,
				sub_category_id,
				sub_category_id,
				query,
				query,
				query,
			],
			(err, rows) => {
				err
					? console.log(err)
					: res.render("content/post", {
							content_css: true,
							post: [...rows],
							title: query,
							is_login: req.cookies["jwt"] ? true : false,
							footer: false,
					  });
			}
		);
	});

	function get_allpost(req, res, sub_type, category, sub_category) {
		db.get_all_post_by_category(category, sub_category, (err, rows) => {
			if (err) {
				return console.log(err.message);
			}
			res.render("content/post", {
				content_css: true,
				post: [...rows],
				title: sub_type,
				is_login: req.cookies["jwt"] ? true : false,
				footer: false,
			});
		});
	}

	function auth_token(req, res, next) {
		const token = req.cookies["jwt"];
		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				req.user = null;
				next;
			}
			req.user = user;
			next();
		});
	}
	return router;
};
