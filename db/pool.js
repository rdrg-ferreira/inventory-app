const { Pool } = require("pg");

const host = process.env.HOST;
const user = process.env.USER;
const db = process.env.DATABASE;
const pw = process.env.PASSWORD;
const port = process.env.PORT;
const builtUrl = `postgresql://${user}:${pw}@${host}:${port}/${db}`;

module.exports = new Pool({
    connectionString: builtUrl
});