// require modules (don"t forget to npm install them too)
var express = require("express");
var exphbs = require("express-handlebars");

// declare variables
var PORT = process.env.PORT || 3000; // set port to local or environment variable for Heroku
var app = express(); // get a pointer to express

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public")); // make public folder available

// use handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

require("./controllers/scraper.js")(app);

// run it
app.listen(PORT, function () {
    console.log("Chatterbox is running on port " + PORT);
});