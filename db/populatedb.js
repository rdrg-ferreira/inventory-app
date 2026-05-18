#! /usr/bin/env node
const { argv } = require("node:process");
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
            ('Apple', 'Fresh crisp apples', 24, 'apple.png'),
            ('Milk', 'Whole milk from local farms', 12, 'milk.png'),
            ('Bread', 'Soft sandwich bread', 18, 'bread.png'),
            ('Cheese Pizza', 'Thin crust pizza with mozzarella', 8, 'pizza.png'),
            ('Sparkling Water', 'Plain sparkling water', 30, 'water.png')
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
