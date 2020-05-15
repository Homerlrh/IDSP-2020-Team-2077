const express = require("express");
const router = express.Router();

module.exports = () => {
	router.get("/:page", (req, res) => {
		res.render(`additional_page/${req.params.page}`, {
			content_css: " ",
			footer: false,
			d_sidebar: false,
		});
	});

	return router;
};
