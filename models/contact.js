import mongoose from 'mongoose';
import Store from '../components/store/Store';

const Schema = mongoose.Schema;

const contact = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: Array,
    of: String,
    required: true,
  },
  facebookName: {
    type: String,
    required: true,
  },
  instagramName: {
    type: String,
    required: true,
  },
  whatsappNum: {
    type: String,
    required: true,
  },
  whatsappMessage: {
    type: String,
    required: true,
  },
  addressOne: {
    type: String,
    required: true,
  },
  addressTwo: {
    type: String,
    required: true,
  },
  addressCep: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

contact.query.mainSocial = function() {
    return this.where({ name: 'main', type: 'store'});
  }

export default mongoose.models.Contact || mongoose.model('Contact', contact);
