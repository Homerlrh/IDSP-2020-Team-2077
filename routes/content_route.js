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

	//get data from db according the params in the url
	router.get("/sub_category/:type/:category/:sub_category", (req, res) => {
		const { type, category, sub_category } = req.params;
		db.get_all_post_by_category(category, sub_category, (err, rows) => {
			if (err) {
				return console.log(err.message);
			}
			res.render("content/post", {
				content_css: "/css/content.css",
				post: [...rows],
				title: type,
			});
		});
	});

	//footer nav bar => get params form bottom nav bar
	router.get("/bottom/:nav", (req, res) => {
		const navigation = req.params.nav;
		res.redirect(`/content/${navigation}`);
	});

	return router;
};
