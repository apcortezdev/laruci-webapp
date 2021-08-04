import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const color = new Schema({
  name: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
});

export default mongoose.models.Color || mongoose.model('Color', color);
