require('dotenv').config();

const PORT = 3000 || process.env.SERVER_PORT;
const MAIL_PASS = process.env.MAIL_PASS;

module.exports = {
    PORT,
    MAIL_PASS
};