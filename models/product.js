import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const product = new Schema({
  code: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  limitStock: {
    type: Boolean,
    required: false,
  },
  stockNumber: {
    type: Number,
    required: false,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  sectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  sets: [
    {
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
          options: [
            {
              name: {
                type: String,
                required: true,
              },
              available: {
                type: String,
                required: true,
              },
            },
          ],
        },
      ],
    },
  ],
});

export default mongoose.models.Product || mongoose.model('Product', product);
