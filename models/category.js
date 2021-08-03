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

export default mongoose.models.Category || mongoose.model('Category', category);