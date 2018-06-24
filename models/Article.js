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
    default: "Summary unavailable."
  },
  link: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: "No available image."
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