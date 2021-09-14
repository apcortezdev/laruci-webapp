/* This is a database connection function*/
import mongoose from 'mongoose';
// import { env } from 'process';

const connection = {}; /* creating connection object*/

async function dbConnect() {
  /* check if we have connection to our databse*/
  if (connection.isConnected) {
    return;
  }
  // env.MONGODEV_URI = 'SRV'
  /* connecting to our database */
  const db = await mongoose.connect(process.env.URIDEVDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
