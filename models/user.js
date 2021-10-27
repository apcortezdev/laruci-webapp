// {
//   "_id": {"$oid": "61799cca5b5200502cc00abe"},
//   "email": "cilaruci@hotmail.com",
//   "createdOn": {"$date": "2021-10-27T18:10:41.969Z"},
//   "hashPassword": "$2a$12$KyreRX63GB4DGiOZUMkzD.lHh9dVjdNK2KZ6w1RLegLlHNpVXPU0G",
//   "recoveryLogs": [],
//   "accessLogs": []
// }

import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const recoveryLogSchema = new Schema({
  country_code: {
    type: String,
    required: true,
  },
  country_name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postal: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  IPv4: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  recoveryToken: {
    type: String,
    required: true,
  },
  requestedOn: {
    type: Date,
    required: true,
  },
  recoveredOn: {
    type: Date,
    required: false,
  },
  exp: {
    type: Date,
    required: false,
  },
});

const accessLogSchema = new Schema({
  country_code: {
    type: String,
    required: true,
  },
  country_name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  postal: {
    type: String,
    required: true,
  },
  latitude: {
    type: String,
    required: true,
  },
  longitude: {
    type: String,
    required: true,
  },
  IPv4: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  accessOn: {
    type: Date,
    default: new Date(),
  },
});

const user = new Schema({
  email: {
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
  recoveryLogs: [recoveryLogSchema],
  accessLogs: [accessLogSchema],
});

user.query.byEmail = function (email) {
  return this.where({ email: email });
};

export default mongoose.models.User || mongoose.model('User', user);
