const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  SALT: bcrypt.genSaltSync(10),
  JWT_KEY: process.env.JWT_KEY,
  EMAIL_ID: process.env.AUTH_EMAIL_ID,
  EMAIL_PASS: process.env.AUTH_EMAIL_PASS,
  BASE_URL: process.env.BASE_URL,
};
