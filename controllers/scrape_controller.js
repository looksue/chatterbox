// require modules, don't forget to "npm install" them
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// point to mongoose
// If deployed, use the deployed database.  Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// actually connect to MongoDB
mongoose.connect(MONGODB_URI);

var mongooseConnection = mongoose.connection;
mongooseConnection.on("error", console.error.bind(console, "connection error:")); // show errors
mongooseConnection.once("open", function () {
    console.log("Mongoose connection worked");
});

// export this stuff for other modules
module.exports = function (app) {
    // Set up routes
    app.get("/", function (req, res) {
        res.render("index");
    });
};

//get StackOverflow news
app.get("/scraper", function (req, res) {
    axios.get("https://stackover.com/").then(function (response) {
        var $ = cheerio.load(response.data);
        var news = {};

        $("a.question-hyperlink").each(function (i, element) {
            news.title = $(this).text();
            news.link = $(this).attr("href");
            database.Question.create(news)
                .then(function (newQuestion) {
                    console.log(newQuestion);
                })
                .catch(function (err) {
                    return res.json(err);
                });
            res.send("News scraped");
        });
    });
});




