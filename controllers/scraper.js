// require modules, don't forget to "npm install" them
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var database = require("../models");

// point to mongoose
// If deployed, use the deployed database.  Otherwise use the local chatterbox database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/chatterbox";

// actually connect to MongoDB
mongoose.connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

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

    //get StackOverflow news
    app.get("/scraper", function (req, res) {
        axios.get("https://stackoverflow.com/questions").then(function (response) {
            var $ = cheerio.load(response.data);
            var num = 0;
            var questions = [];

            $("a.question-hyperlink").each(function (i, element) {
                num += 1;
                var question = {};
                question.title = $(this).text();
                question.link = "https://stackoverflow.com" + $(this).attr("href");
                if (question.title && question.link) {
                    questions.push(question);
                }
                database.Question.create(question)
                    .then(function (newQuestion) {
                        question.id = newQuestion._id;
                        console.log(newQuestion);
                    })
                    .catch(function (err) {
                        return res.json(err);
                    });
            });
            var hbsObject = { question: questions, num: num };
            //redirect to articles page and display results
            res.render("index", hbsObject);
        });
    });

    // get Questions
    app.get("/Questions", function (req, res) {
        database.Question.find({})
            .then(function (newQuestion) {
                res.json(newQuestion);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    //get a certain Question
    app.get("/Questions/:id", function (req, res) {
        database.Question.findOne({
            _id: req.params._id
        })
            .populate("note")
            .then(function (newQuestion) {
                res.json(newQuestion);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    //save a Note
    app.post("/Questions/:id", function (req, res) {
        database.Note.create(req.body)
            .then(function (newNote) {
                //Making the new Note worked, so tie it to the Question that has the matching id.
                //The second .then function will get back that updated Question and data, because of the promise
                return database.Question.findOneAndUpdate(
                    {
                        _id: req.params._id
                    },
                    {
                        note: newNote._id
                    },
                    {
                        new: true
                    }
                );
            })
            .then(function (newQuestion) {
                //Update Question worked
                res.json(newQuestion);
            })
            .catch(function (err) {
                res.json(err);
            });
    });
};
