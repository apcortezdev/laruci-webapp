import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const section = new Schema({
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

export default mongoose.models.Section || mongoose.model('Section', section);