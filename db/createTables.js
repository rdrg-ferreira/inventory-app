#! /usr/bin/env node
const { argv } = require("node:process");
const { Client } = require("pg");

const SQL = `
    DROP TABLE IF EXISTS item_category;
    DROP TABLE IF EXISTS item;
    DROP TABLE IF EXISTS category;
    DROP SEQUENCE IF EXISTS item_id_seq;
    DROP SEQUENCE IF EXISTS category_id_seq;

    CREATE TABLE item (
        id		 BIGSERIAL,
        name		 VARCHAR(512) NOT NULL,
        description	 VARCHAR(512),
        quantity	 BIGINT NOT NULL DEFAULT 0,
        PRIMARY KEY(id)
    );

    CREATE TABLE category (
        id	 BIGSERIAL,
        name VARCHAR(512) NOT NULL,
        PRIMARY KEY(id)
    );

    CREATE TABLE item_category (
        item_id	 BIGINT,
        category_id BIGINT,
        PRIMARY KEY(item_id,category_id)
    );

    ALTER TABLE item_category ADD CONSTRAINT item_category_fk1 FOREIGN KEY (item_id) REFERENCES item(id);
    ALTER TABLE item_category ADD CONSTRAINT item_category_fk2 FOREIGN KEY (category_id) REFERENCES category(id);
`;

async function main() {
    console.log("creating tables...");

    const dbUrl = argv[2];

    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const db = process.env.DB_NAME;
    const pw = process.env.DB_PASSWORD;
    const port = process.env.DB_PORT;
    const builtUrl = `postgresql://${user}:${pw}@${host}:${port}/${db}`;

    const client = new Client({
        connectionString: dbUrl ? dbUrl : builtUrl,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log("done");
}

main();
