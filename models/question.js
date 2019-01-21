const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String },
  options: [
    {
      text: { type: String },
      pros: { type: String },
      cons: { type: String }
    }
  ],
  category: { type: String },
  active: {type: Boolean}
});

questionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, res) => {
    delete res._id;
    delete res.__v;
    delete res.answers;
  }
});

module.exports = mongoose.model('Question', questionSchema);
