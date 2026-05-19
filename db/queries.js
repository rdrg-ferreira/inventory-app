const pool = require("./pool");

async function getItems() {
    const query = "SELECT name, quantity, id FROM item ORDER BY id"
    const { rows } = await pool.query(query);
    return rows;
}

async function getCategories() {
    const query = "SELECT name FROM category ORDER BY id"
    const { rows } = await pool.query(query);
    return rows;
}

async function getItem(id) {
    const query = "SELECT * FROM item WHERE id = $1";
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

async function updateItem(id, name, description, quantity) {
    const query = "UPDATE item SET name = $1, description = $2, quantity = $3 WHERE id = $4";
    const values = [name, description, quantity, id];
    const { rowCount } = await pool.query(query, values);
    return rowCount;
}

module.exports = {
    getItems,
    getCategories,
    getItem,
    updateItem,
};