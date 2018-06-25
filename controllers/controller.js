var path = require("path");
var express = require("express");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
const logger = require('morgan');

// Require all models
var db = require("../models");

// Create all html (no passport authentication required) query routes.
module.exports = function (app) {

    // "/" route loads home.handlebars
    app.get("/", function (req, res) {
        res.render("home");
    });

    // A GET route for scraping the New York Times website
    app.get("/scrape", function (req, res) {
        // get all articles from the database
        db.Article.find({})
            .then((cachedArticles) => {
                // first create array of cached article titles
                let cachedTitle = cachedArticles.map(article => article.title);

                // next grab the body of the html with request
                axios.get("http://www.newyorktimes.com/").then(function (response) {

                    // Then, we load that into cheerio and save it to $ for a shorthand selector
                    var $ = cheerio.load(response.data);
                    // create new array to hold new articles
                    let newArticles = [];

                    //Now iterate through scraped articles to make newArticle object
                    $("article h2").each(function (i, element) {
                        // Save an empty result object
                        var result = {};

                        // Add the text and href of every link, and save them as properties of the result object
                        result.title = $(this)
                            .children("a")
                            .text();
                        result.summary = $(this)
                            .children(".summary")
                            .text();
                        result.link = $(this)
                            .children("a")
                            .attr("href");
                        result.image = $(this)
                            .children("img")
                            .attr('src')

                        // check for new article URL link
                        if (result.link) {
                            // check if new article already in cached articles in database
                            if (!cachedTitle.includes(result.title)) {
                                // add to array of new articles to push into database
                                newArticles.push(result);
                            }
                        }
                    });

                    // Create a new Article using the newArticle object built from scraping
                    db.Article.create(newArticles)
                        .then(function (dbArticle) {
                            // View the added result in the console
                            console.log(dbArticle)
                            // Count of New Articles
                            res.json({
                                newArticleCount: newArticles.length
                            })
                        })
                        .catch(function (err) {
                            // If an error occurred, send it to the client
                            return res.json(err);
                        });
                })
            })
            .catch(function (err) {
                // axios error
                console.log(err);
            })
            .catch(function (err) {
                // db.find error
                console.log(err);
            })
    })

    // route for view_articles
    app.get("/view_articles", function (req, res) {
        db.Article.find({}).limit(20)
            .then(function (DbArticles) {
                res.render(("view_articles"), { articles: DbArticles })
                    .catch(function (err) {
                        // db.find error
                        console.log(err);
                    })
            })
    });

    // Save an article
    app.post("/save_article/:id", function (req, res) {
        // Use the article id to find and update its saved boolean
        db.Article.update({ "_id": req.params.id }, { "saved": true })
            .then(function (DbArticles) {
                console.log(DbArticles)
                res.render(("view_articles"), { articles: DbArticles })
                    .catch(function (err) {
                        // db.find error
                        console.log(err);
                    })
            });
    });

    // route for getting saved_articles
    app.get("/saved_articles", function (req, res) {
        db.Article.find({ "saved": true }).populate("notes")
            //.exec(function (error, articles) {
            .then(function (DbArticles) {
                res.render("saved_articles", { articles: DbArticles });
            });
    });

    // Delete a saved article
    app.post("/delete_article/:id", function (req, res) {
        // Use the article id to find and update its saved boolean
        db.Article.update({ "_id": req.params.id }, { "saved": false, "notes": [] })
            .then(function (DbArticles) {
                console.log(DbArticles)
                res.render(("view_articles"), { articles: DbArticles })
                    .catch(function (err) {
                        // db.find error
                        console.log(err);
                    })
            });
    });

    // Route for grabbing a specific Article by id, populate it with it's note
    app.get("/articles/:id", function (req, res) {
        // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
        db.Article.findOne({ _id: req.params.id })
            // ..and populate all of the notes associated with it
            .populate("note")
            .then(DbNotes => {
                res.json({
                    notesData: DbNotes
                })
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    // POST route - create a new note
    app.post('/save_note', function (req, res) {
        var articleId = req.body._id;
        var note = { body: req.body.noteText };

        db.Note
            .create(note)
            .then(result => {
                db.Article
                    .findByIdAndUpdate(articleId, { $push: { notes: result._id } }, { new: true })//saving reference to note in corresponding article
                    .then(data => res.json(result))
                    .catch(err => res.json(err));
            })
            .catch(err => res.json(err));
    });

    // Delete a note
    app.delete('/delete_note/:id', function (req, res) {
        db.Note
            .findByIdAndDelete(req.params.id)
            .then(result => res.json(result))
            .catch(err => res.json(err));
    });

}; 