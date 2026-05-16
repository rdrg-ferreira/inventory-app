#! /usr/bin/env node
import { argv } from "node:process";
const { Client } = require("pg");

const SQL = `
    CREATE TABLE item (
        id		 BIGSERIAL,
        name		 VARCHAR(512) NOT NULL,
        description	 VARCHAR(512),
        quantity	 BIGINT NOT NULL DEFAULT 0,
        image_file_name VARCHAR(512),
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

    const host = process.env.HOST;
    const user = process.env.USER;
    const db = process.env.DATABASE;
    const pw = process.env.PASSWORD;
    const port = process.env.PORT;
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
