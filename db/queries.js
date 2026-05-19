const pool = require("./pool");

async function getItems() {
    const query = "SELECT i.name, i.quantity, i.id, COALESCE(c.name, 'None') category FROM item i LEFT JOIN item_category ic ON i.id = ic.item_id LEFT JOIN category c ON ic.category_id = c.id ORDER BY i.id";
    const { rows } = await pool.query(query);
    return rows;
}

async function getCategories() {
    const query = "SELECT * FROM category ORDER BY id";
    const { rows } = await pool.query(query);
    return rows;
}

async function getItem(id) {
    const query = "SELECT i.*, COALESCE(c.name, 'None') category, COALESCE(c.id, -1) category_id FROM item i LEFT JOIN item_category ic ON i.id = ic.item_id LEFT JOIN category c ON ic.category_id = c.id WHERE i.id = $1";
    const values = [id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

async function updateItem(id, name, description, quantity, category_id) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const res1 = await client.query(
            'UPDATE item SET name = $1, description = $2, quantity = $3 WHERE id = $4',
            [name, description, quantity, id]
        );

        let res2;
        if (category_id === "-1") {
            res2 = await client.query(
                'DELETE FROM item_category WHERE item_id = $1',
                [id]
            );
        } else {
            const prev_category_id = await client.query("SELECT category_id FROM item_category WHERE item_id = $1", [id]);
            if (prev_category_id.rowCount !== 0) {
                res2 = await client.query(
                    'UPDATE item_category SET category_id = $1 WHERE item_id = $2',
                    [category_id, id]
                );
            } else {
                res2 = await client.query(
                    'INSERT INTO item_category (item_id, category_id) VALUES ($2, $1)',
                    [category_id, id]
                );
            }
        }

        await client.query('COMMIT');
        return res1.rowCount + res2.rowCount;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

async function deleteItem(id) {
    const client = await pool.connect();
    try {
        let rowCount = 0;
        await client.query('BEGIN');

        const has_category = await client.query("SELECT item_id FROM item_category WHERE item_id = $1", [id]);
        if (has_category.rowCount === 1) {
            const res1 = await client.query('DELETE FROM item_category WHERE item_id = $1', [id]);
            rowCount++;
        }

        const res2 = await client.query("DELETE FROM item WHERE id = $1", [id]);
        rowCount += res2.rowCount;

        await client.query('COMMIT');
        return rowCount;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    getItems,
    getCategories,
    getItem,
    updateItem,
    deleteItem,
};