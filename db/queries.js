const pool = require("./pool");

async function getItems() {
    const query = "SELECT name, image_file_name, quantity, id FROM item"
    const { rows } = await pool.query(query);
    return rows;
}

async function getCategories() {
    const query = "SELECT name FROM category"
    const { rows } = await pool.query(query);
    return rows;
}

async function getItem(id) {
    const query = "SELECT * FROM item WHERE id = $1";
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

module.exports = {
    getItems,
    getCategories,
    getItem,
};