const express = require("express");
const app = express();
const path = require("node:path");
const indexRouter = require("./routes/indexRouter");
const itemsRouter = require("./routes/itemsRouter");
const categoriesRouter = require("./routes/categoriesRouter");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/items", itemsRouter);
app.use("/categories", categoriesRouter);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

const PORT = 3000;
app.listen(PORT, (error) => {
    if (error) {
        throw error;
    }
    console.log(`Express app listening on port ${PORT}!`);
});
