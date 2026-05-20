const db = require("../db/queries");

async function getCategoriesPage(req, res) {
    const categories = await db.getCategories();

    res.render("categories_page/categories", {
        categories,
    })
}

function getNewCategoryForm(req, res) {
    res.render("categories_page/form", {
        title: "Create category",
        formAction: "/categories/new",
    });
}

async function createCategory(req, res) {
    const { name } = req.body;
    const newId = await db.createCategory(name);
    res.redirect("/categories");
}

async function getUpdateCategoryForm(req, res) {
    const id = req.params.categoryId;
    const category = await db.getCategory(id);
    res.render("categories_page/form", {
        title: "Edit category",
        formAction: `/categories/${id}/update`,
        category: category,
    });
}

async function updateCategory(req, res) {
    const { name } = req.body;
    const id = req.params.categoryId;
    const rowCount = await db.updateCategory(id, name);
    res.redirect("/categories");
}

async function deleteCategory(req, res) {
    const id = req.params.categoryId;
    const rowCount = await db.deleteCategory(id);
    res.redirect("/categories");
}

module.exports = {
    getCategoriesPage,
    getNewCategoryForm,
    createCategory,
    getUpdateCategoryForm,
    updateCategory,
    deleteCategory,
};