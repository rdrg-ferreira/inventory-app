const { Router } = require("express");
const categoriesController = require("../controllers/categoriesController");
const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getCategoriesPage);
categoriesRouter.get("/new", categoriesController.getNewCategoryForm);
categoriesRouter.post("/new", categoriesController.createCategory);
categoriesRouter.get("/:categoryId/update", categoriesController.getUpdateCategoryForm);
categoriesRouter.post("/:categoryId/update", categoriesController.updateCategory);
categoriesRouter.post("/:categoryId/delete", categoriesController.deleteCategory);

module.exports = categoriesRouter;
