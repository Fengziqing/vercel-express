require("dotenv").config();

const PORT = 3000 || process.env.SERVER_PORT;
const MAIL_PASS = process.env.MAIL_PASS;
const MONGODB_URL = process.env.MONGODB_URL;

module.exports = {
  PORT,
  MAIL_PASS,
  MONGODB_URL,
};
