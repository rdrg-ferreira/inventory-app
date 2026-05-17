const db = require("../db/queries");

async function getCategoriesPage(req, res) {
    const categories = await db.getCategories();

    res.render("categories", {
        categories,
    })
}

module.exports = {
    getCategoriesPage,
};