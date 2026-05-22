const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");

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

    res.render("item_page/form", {
        item,
        categories,
        formAction: `/items/${id}/update`,
        title: "Edit item",
    });
}

const validateItem = [
    body("name").trim().notEmpty().withMessage("Name can not be empty.").isAlphanumeric().withMessage("Name must only contain alphabet letters and/or numbers."),
    body("description").trim().optional({ checkFalsy: true }).isAlphanumeric().withMessage("Description must only contain alphabet letters and/or numbers."),
    body("quantity").trim().notEmpty().withMessage("Quantity can not be empty.").isInt().withMessage("Quantity must be an integer."),
    body("category").toInt(),
];

const updateItem = [
    validateItem,
    async (req, res) => {
        const errors = validationResult(req);
        const id = req.params.itemId;

        if (!errors.isEmpty()) {
            const item = await db.getItem(id);
            const categories = await db.getCategories();

            return res.status(400).render("item_page/form", {
                item,
                categories,
                formAction: `/items/${id}/update`,
                title: "Edit item",
                errors: errors.array(),
            });
        }

        const { name, description, quantity, category } = matchedData(req);
        const rowCount = await db.updateItem(id, name, description, quantity, category);

        if (rowCount === 2) res.redirect(`/items/${id}`);
    }
];

async function deleteItem(req, res) {
    const id = req.params.itemId;
    const rowCount = await db.deleteItem(id);
    res.redirect("/items");
}

async function getNewItemForm(req, res) {
    const categories = await db.getCategories();

    res.render("item_page/form", {
        categories,
        formAction: `/items/new`,
        title: "Create item",
    });
}

const createItem = [
    validateItem,
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const categories = await db.getCategories();

            return res.status(400).render("item_page/form", {
                categories,
                formAction: `/items/new`,
                title: "Create item",
                errors: errors.array(),
            });
        }

        const { name, description, quantity, category } = matchedData(req);
        const newId = await db.createItem(name, description, quantity, category);
        res.redirect(`/items/${newId}`);
    }
];

module.exports = {
    getItemsPage,
    getItem,
    getItemUpdateForm,
    updateItem,
    deleteItem,
    getNewItemForm,
    createItem,
};