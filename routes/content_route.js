const express = require("express");
const router = express.Router();

module.exports = (db) => {
	router.get("/", (req, res) => {
		res.render("content/home", { content_css: "/css/content.css" });
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
		// db.get_all_post_by_category(category, sub_category, (err, rows) => {
		// 	if (err) {
		// 		return console.log(err.message);
		// 	}
		// 	console.log(rows);
		// });
		res.send("abcasndi");
	});

	//footer nav bar => get params form bottom nav bar
	router.get("/bottom/:nav", (req, res) => {
		const navigation = req.params.nav;
		res.render(`content/${navigation}`, { content_css: "/css/content.css" });
	});

	return router;
};
