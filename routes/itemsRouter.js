const { Router } = require("express");
const itemsController = require("../controllers/itemsController");
const itemsRouter = Router();

itemsRouter.get("/", itemsController.getItemsPage);
itemsRouter.get("/:itemId", itemsController.getItem);

module.exports = itemsRouter;
