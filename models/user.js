import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const user = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdOn: {
    type: Date,
    default: new Date(),
  },
});

user.query.byEmail = function(email) {
  return this.where({ email: email});
}

export default mongoose.models.User || mongoose.model('User', user);