import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const sizeSet = new Schema({
  name: {
    type: String,
    required: true,
  },
  isMain: {
    type: Boolean,
    default: false,
  },
  sizes: {
    type: Array,
    of: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

sizeSet.query.findMain = function() {
  return this.where({ isMain: true});
}

export default mongoose.models.SizeSet || mongoose.model('SizeSet', sizeSet);
