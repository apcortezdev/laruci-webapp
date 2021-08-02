import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const color = new Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Color', color);
