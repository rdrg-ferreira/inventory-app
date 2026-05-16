#! /usr/bin/env node
import { argv } from "node:process";
const { Client } = require("pg");

const SQL = `
    BEGIN;

    DELETE FROM item_category;
    DELETE FROM item;
    DELETE FROM category;

    WITH inserted_categories AS (
        INSERT INTO category (name) VALUES
            ('Produce'),
            ('Dairy'),
            ('Bakery'),
            ('Prepared')
        RETURNING id, name
    ), inserted_items AS (
        INSERT INTO item (name, description, quantity, image_file_name) VALUES
            ('Apple', 'Fresh crisp apples', 24, 'apple.jpg'),
            ('Milk', 'Whole milk from local farms', 12, 'milk.jpg'),
            ('Bread', 'Soft sandwich bread', 18, 'bread.jpg'),
            ('Cheese Pizza', 'Thin crust pizza with mozzarella', 8, 'pizza.jpg'),
            ('Sparkling Water', 'Plain sparkling water', 30, 'water.jpg')
        RETURNING id, name
    )
    INSERT INTO item_category (item_id, category_id)
    SELECT inserted_items.id, inserted_categories.id
    FROM inserted_items
    JOIN inserted_categories ON (
        (inserted_items.name = 'Apple' AND inserted_categories.name = 'Produce') OR
        (inserted_items.name = 'Milk' AND inserted_categories.name = 'Dairy') OR
        (inserted_items.name = 'Bread' AND inserted_categories.name = 'Bakery') OR
        (inserted_items.name = 'Cheese Pizza' AND inserted_categories.name = 'Dairy') OR
        (inserted_items.name = 'Cheese Pizza' AND inserted_categories.name = 'Prepared')
    );

    COMMIT;
`;

async function main() {
    console.log("populating tables...");

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
