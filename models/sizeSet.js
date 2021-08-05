import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sizeSet = new Schema({
  name: {
    type: String,
    required: true,
  },
  sizes: {
    type: Array,
    of: String,
    required: true,
  },
});

export default mongoose.models.SizeSet || mongoose.model('SizeSet', sizeSet);
