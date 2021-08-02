import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const size = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  sizeCm: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Size', size);
