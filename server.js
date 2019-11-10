// require modules (don't forget to npm install them too)
var express = require('express');
var exphbs = require('express-handlebars');
var db = require("./models");

// declare variables
var PORT = process.env.PORT || 3000; // set port to local or environment variable for Heroku
var app = express(); // get a pointer to express

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public")); // make public folder available

require("./controllers/scrape_controller.js")(app);

// run it
app.listen(PORT, function() {
    console.log(`Chatterbox listening on PORT ${PORT}`);
})