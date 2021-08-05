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
});

export default mongoose.models.Section || mongoose.model('Section', section);