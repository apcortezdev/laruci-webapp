import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const client = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cpf: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  hashPassword: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

client.query.byEmail = function (email) {
  return this.where({ email: email });
};

export default mongoose.models.Client || mongoose.model('Client', client);
