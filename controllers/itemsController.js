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

    res.render("item_page/item", {
        item,
    });
}

async function getItemUpdateForm(req, res) {
    const id = req.params.itemId;
    const item = await db.getItem(id);
    const categories = await db.getCategories();

    res.render("item_page/update", {
        item,
        categories,
    });
}

async function updateItem(req, res) {
    const id = req.params.itemId;
    const { name, description, quantity, category } = req.body;
    const rowCount = await db.updateItem(id, name, description, quantity, category);

    if (rowCount === 2) res.redirect(`/items/${id}`);
}

module.exports = {
    getItemsPage,
    getItem,
    getItemUpdateForm,
    updateItem,
};