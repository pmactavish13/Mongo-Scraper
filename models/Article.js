var mongoose = require("mongoose");

var Note = require("./Note");

// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  note: [{
     type: Schema.Types.ObjectId,
     ref: "Note"
  }]
});

// Create the Article model using mongoose's model and above schema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;