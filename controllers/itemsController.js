const db = require("../db/queries");

async function getItemsPage(req, res) {
    const items = await db.getItems();
    const categories = await db.getCategories();

    res.render("items", {
        items,
        categories,
    })
}

module.exports = {
    getItemsPage,
};