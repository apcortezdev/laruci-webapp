import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const Notice = new Schema({
  text: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endDate: {
    type: Date,
    required: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
    index: true,
  },
});

export default mongoose.models.Notice || mongoose.model('Notice', Notice);
