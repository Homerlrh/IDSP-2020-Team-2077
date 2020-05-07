const express = require("express");
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
	router.get("/sub_category/:type/:category/:sub_category", (req, res) => {
		const { type, category, sub_category } = req.params;
		db.get_all_post_by_category(category, sub_category, (err, rows) => {
			if (err) {
				return console.log(err.message);
			}
			res.render("content/post", {
				content_css: true,
				post: [...rows],
				title: type,
				is_login: req.cookies["jwt"] ? true : false,
				footer: false,
			});
		});
	});

	router.get("/post_detail/:post_id", (req, res) => {
		const id = req.params.post_id;
		db.get_post_detail(id, (err, rows) => {
			return err
				? console.log(err.message)
				: res.render("content/detailpost", {
						seller: JSON.parse({ ...rows[0] }.seller),
						picture: JSON.parse({ ...rows[0] }.image),
						post: { ...rows[0] },
						content_css: "/css/content.css",
						is_login: req.cookies["jwt"] ? true : false,
						footer: false,
				  });
		});
	});

	return router;
};
