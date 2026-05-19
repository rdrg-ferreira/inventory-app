const db = require("../db/queries");

async function getItemsPage(req, res) {
    const items = await db.getItems();
    const categories = await db.getCategories();

    res.render("items_page/items", {
        items,
        categories,
    })
}

async function getItem(req, res) {
    const id = req.params.itemId;
    const item = await db.getItem(id);

    res.render("item", {
        item,
    });
}

module.exports = {
    getItemsPage,
    getItem,
};