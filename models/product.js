import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const setSchema = new Schema({
  colorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Color',
    required: true,
  },
  colorName: {
    type: String,
    required: true,
  },
  colorCode: {
    type: String,
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

const product = new Schema({
  code: {
    type: String,
    required: true,
    index: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
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
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  categoryName: {
    type: String,
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
  sets: [setSchema],
});

product.query.byCode = function (code) {
  return this.where({ code: new RegExp(code, 'i') });
};

// product.query.byCategory = function (categoryId) {
//   return this.where({ categoryId: categoryId });
// };

export default mongoose.models.Product || mongoose.model('Product', product);
