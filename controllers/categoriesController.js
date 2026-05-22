const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

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

const validateCategory = [
    body("name").trim().notEmpty().withMessage("Name can not be empty.").matches(/^[a-zA-Z0-9 ]+$/).withMessage("Name must only contain alphabet letters, numbers, and spaces."),
];

const createCategory = [
    validateCategory,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).render("categories_page/form", {
                formAction: "/categories/new",
                title: "Create category",
                errors: errors.array(),
            });
        }

        const { name } = matchedData(req);
        const newId = await db.createCategory(name);
        res.redirect("/categories");
    }
];

async function getUpdateCategoryForm(req, res) {
    const id = req.params.categoryId;
    const category = await db.getCategory(id);
    res.render("categories_page/form", {
        title: "Edit category",
        formAction: `/categories/${id}/update`,
        category: category,
    });
}

const updateCategory = [
    validateCategory,
    async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.categoryId;

        if (!errors.isEmpty()) {
            const category = await db.getCategory(id);

            return res.status(400).render("categories_page/form", {
                title: "Edit category",
                formAction: `/categories/${id}/update`,
                category: category,
                errors: errors.array(),
            });
        }

        const { name } = matchedData(req);
        const rowCount = await db.updateCategory(id, name);
        res.redirect("/categories");
    }
];

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