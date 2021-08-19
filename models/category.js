import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const category = new Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

category.query.byText = function(text) {
  return this.where({ text: text});
}

category.query.byName = function(name) {
  return this.where({ name: name});
}

export default mongoose.models.Category || mongoose.model('Category', category);