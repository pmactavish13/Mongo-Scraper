// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var path = require('path');
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require('axios');

// Scraping tools
var cheerio = require('cheerio');
var request = require('request');

var app = express();

// // Require all models
var db = require("./models");

// define Port
var PORT = process.env.PORT || 3000;

// handlebars route to static files - css, img
app.use(express.static('public'));

// Use morgan and body parser with app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
require("./controllers/controller.js")(app);

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://heroku_kl033f84:n6fvlc18cshg4e4ffqcp13nulm@ds117701.mlab.com:17701/heroku_kl033f84";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.connect(MONGODB_URI);
// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/Mongo-Scraper2");
// mongoose.connect(MONGODB_URI);
// mongoose.connect("mongodb://heroku_kl033f84:n6fvlc18cshg4e4ffqcp13nulm@ds117701.mlab.com:17701/heroku_kl033f84");

// Show any mongoose errors
mongoose.connection.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
mongoose.connection.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Initiate database interface and start our server so that it can begin listening to client requests.
app.listen(PORT, function (err) {
    if (!err) {
        // Log (server-side) when our server has started
        console.log("Server listening on: http://localhost:" + PORT);
    }
    else {
        console.log(err);
    }
});

