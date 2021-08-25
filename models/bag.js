import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const bag = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  location: {
    country_code: {
      type: String,
      required: false,
    },
    country_name: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    postal: {
      type: String,
      required: false,
    },
    latitude: {
      type: String,
      required: false,
    },
    longitude: {
      type: String,
      required: false,
    },
    IPv4: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      selectedSet: {
        type: String,
        required: true,
      },
      selectedSizes: [
        {
          sizeId: {
            type: String,
            required: false,
          },
          selected: {
            type: String,
            required: false,
          },
        },
      ],
      selectedExtras: [
        {
          extraId: {
            type: String,
            required: false,
          },
          selected: {
            type: String,
            required: false,
          },
        },
      ],
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

export default mongoose.models.Bag || mongoose.model('Bag', bag);
