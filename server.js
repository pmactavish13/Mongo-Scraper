// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");
var app = express();

// Scraping tools
var cheerio = require('cheerio');
var request = require('request');

// Require all models
var db = require("./models");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Connect to the Mongo DB
// mongoose.connect(MONGODB_URI);

var PORT = process.env.PORT || 3000;

// Use morgan and body parser with app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
 }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
require("./routes/routes.js")(app);

// handlebars rout to static files - css, img
app.use(express.static('public'));

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

