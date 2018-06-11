var path = require("path");
var express = require("express");

// Create all html (no passport authentication required) query routes.
module.exports = function (app) {
    
    // "/" route loads home.handlebars
    app.get("/", function (req, res) {
        res.render(path.join(__dirname, "../views/home.handlebars"));
    });
};