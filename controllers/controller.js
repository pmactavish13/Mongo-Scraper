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
                console.log(DbArticles)
                res.render(("view_articles"), { articles: DbArticles});
            })
    });

    // Route for getting all Articles scraped
    //app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    // db.Article.find({}).limit(20)
    //     .then(function (dbArticle) {
    //         // If we were able to successfully find Articles, send them back to the client
    //         res.json(dbArticle)
    //     })
    //     .catch(function (err) {
    //         // If an error occurred, send it to the client
    //         res.json(err);
    //     });
    //});

    // // Route for grabbing a specific Article by id, populate it with it's note
    // app.get("/articles/:id", function (req, res) {
    //     // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    //     db.Article.findOne({ _id: req.params.id })
    //         // ..and populate all of the notes associated with it
    //         .populate("note")
    //         .then(function (dbArticle) {
    //             // If we were able to successfully find an Article with the given id, send it back to the client
    //             res.json(dbArticle);
    //         })
    //         .catch(function (err) {
    //             // If an error occurred, send it to the client
    //             res.json(err);
    //         });
    // });

    // // Route for saving/updating an Article's associated Note
    // app.post("/articles/:id", function (req, res) {
    //     // Create a new note and pass the req.body to the entry
    //     db.Note.create(req.body)
    //         .then(function (dbNote) {
    //             // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    //             // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    //             // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    //             return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    //         })
    //         .then(function (dbArticle) {
    //             // If we were able to successfully update an Article, send it back to the client
    //             res.json(dbArticle);
    //         })
    //         .catch(function (err) {
    //             // If an error occurred, send it to the client
    //             res.json(err);
    //         });
    // });


    // // Delete an article
    // app.post("/articles/delete/:id", function (req, res) {
    //     // Use the article id to find and update its saved boolean
    //     Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
    //         // Execute the above query
    //         .exec(function (err, doc) {
    //             // Log any errors
    //             if (err) {
    //                 console.log(err);
    //             }
    //             else {
    //                 // Or send the document to the browser
    //                 res.send(doc);
    //             }
    //         });
    // });


    // // Create a new note
    // app.post("/notes/save/:id", function (req, res) {
    //     // Create a new note and pass the req.body to the entry
    //     var newNote = new Note({
    //         body: req.body.text,
    //         article: req.params.id
    //     });
    //     console.log(req.body)
    //     // And save the new note the db
    //     newNote.save(function (error, note) {
    //         // Log any errors
    //         if (error) {
    //             console.log(error);
    //         }
    //         // Otherwise
    //         else {
    //             // Use the article id to find and update it's notes
    //             Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
    //                 // Execute the above query
    //                 .exec(function (err) {
    //                     // Log any errors
    //                     if (err) {
    //                         console.log(err);
    //                         res.send(err);
    //                     }
    //                     else {
    //                         // Or send the note to the browser
    //                         res.send(note);
    //                     }
    //                 });
    //         }
    //     });
    // });

    // // Delete a note
    // app.delete("/notes/delete/:note_id/:article_id", function (req, res) {
    //     // Use the note id to find and delete it
    //     Note.findOneAndRemove({ "_id": req.params.note_id }, function (err) {
    //         // Log any errors
    //         if (err) {
    //             console.log(err);
    //             res.send(err);
    //         }
    //         else {
    //             Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
    //                 // Execute the above query
    //                 .exec(function (err) {
    //                     // Log any errors
    //                     if (err) {
    //                         console.log(err);
    //                         res.send(err);
    //                     }
    //                     else {
    //                         // Or send the note to the browser
    //                         res.send("Note Deleted");
    //                     }
    //                 });
    //         }
    //     });
    // });

}; 