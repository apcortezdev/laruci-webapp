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
});

module.exports = mongoose.model('Category', category);
