// require the Mongoose module (don't forget to nmp install it)
var mongoose = require("mongoose");

// point to the mongoose schema
var Schema = mongoose.Schema;

// make a new Note schema based on mongoose's
var NoteSchema = new Schema({
  title: String,
  body: String
});

// use Mongoose to make a note model
var Note = mongoose.model("Note", NoteSchema);

// export it for other modules
module.exports = Note;