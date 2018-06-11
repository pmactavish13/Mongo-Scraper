var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var request = require('request');

var app = express();

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);

var PORT = process.env.PORT || 3000;

// bodyParser to translate urlform and json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and give the server access to them.
// require("./routes/html_routes.js")(app);
require("./controllers/html_controller.js")(app);

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

