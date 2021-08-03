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
  // console.log(process.env.MONGODEV_URI)
  const db = await mongoose.connect(process.env.MONGODEV_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
