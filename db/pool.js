const { Pool } = require("pg");

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const db = process.env.DB_NAME;
const pw = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const builtUrl = `postgresql://${user}:${pw}@${host}:${port}/${db}`;

module.exports = new Pool({
    connectionString: process.env.PROD_DB_INTERNAL_URL ?? builtUrl
});