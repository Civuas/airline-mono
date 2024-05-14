require("dotenv").config();
const path = require("path");
const storage = path.join(__dirname, "../../Auth_sqlite3.db");

module.exports = {
  development: {
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_FLIGHT,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // dialect: "mysql",
    dialect: "sqlite",
    storage,
  },
  test: {
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_FLIGHT,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // dialect: "mysql",
    dialect: "sqlite",
    storage: ":memory",
  },
  production: {
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB_FLIGHT,
    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // dialect: "mysql",
    dialect: "sqlite",
    storage,
  },
};
