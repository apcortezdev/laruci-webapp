import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const setSchema = new Schema({
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: true,
  },
  sizeSets: [
    {
      name: {
        type: String,
        required: true,
      },
      isUnique: {
        type: Boolean,
        required: true,
      },
      sizeSetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SizeSet',
        required: true,
      },
      availableSizes: {
        type: Array,
        of: String,
        required: true,
      },
    },
  ],
  images: [
    {
      type: String,
      required: true,
    },
  ],
  extraOptions: [
    {
      name: {
        type: String,
        required: true,
      },
      options: {
        type: Array,
        of: String,
        required: true,
      },
    },
  ],
});

export default mongoose.models.ProductSet || mongoose.model('ProductSet', setSchema);
