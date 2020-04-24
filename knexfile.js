require("dotenv").config();
module.exports = {
	development: {
		client: "mysql",
		connection: {
			user: process.env.admin,
			password: process.env.password,
			database: `craigslist`,
			host: process.env.DSN || "35.203.176.28",
		},
		migrations: {
			directory: __dirname + "/Knex/migrations",
		},
		seeds: { directory: __dirname + "/Knex/seeds" },
	},
};
