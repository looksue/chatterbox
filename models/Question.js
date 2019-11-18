var Schema = mongoose.Schema;

// create a new Question schema from it
var QuestionSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // note is linked to the Note model by 'ref', and that lets us link a Question to a note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// create the Question model
var Question = mongoose.model("Question", QuestionSchema);

// export this for other modules
module.exports = Question;