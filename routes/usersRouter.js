const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.getIndex);
usersRouter.get("/items", usersController.getItems);
usersRouter.get("/categories", usersController.getCategories);

module.exports = usersRouter;
