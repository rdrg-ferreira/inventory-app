const { Router } = require("express");
const itemsController = require("../controllers/itemsController");
const itemsRouter = Router();

itemsRouter.get("/", itemsController.getItemsPage);
itemsRouter.get("/new", itemsController.getNewItemForm);
itemsRouter.post("/new", itemsController.createItem);
itemsRouter.get("/:itemId", itemsController.getItem);
itemsRouter.get("/:itemId/update", itemsController.getItemUpdateForm);
itemsRouter.post("/:itemId/update", itemsController.updateItem);
itemsRouter.post("/:itemId/delete", itemsController.deleteItem);

module.exports = itemsRouter;
