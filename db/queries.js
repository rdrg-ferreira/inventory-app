const pool = require("./pool");

async function getItems() {
    const query = "SELECT name, image_file_name, quantity FROM item"
    const { rows } = await pool.query(query);
    return rows;
}

async function getCategories() {
    const query = "SELECT name FROM category"
    const { rows } = await pool.query(query);
    return rows;
}

module.exports = {
    getItems,
    getCategories,
};