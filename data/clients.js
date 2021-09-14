import Client from '../models/client';
import dbConnect from '../utils/dbConnect';
import { hash } from 'bcryptjs';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

export async function postClient(client) {

  const newClient = new Client({
    name: client.name.toLowerCase().trim(),
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C9: ' + err.message);
  }

  try {
    const created = await newClient.save();
    return created;
  } catch (err) {
    if (err.message.startsWith('DUPLICATED')) {
      throw new Error('DUPLICATED');
    } else {
      throw new Error('ERN0C10: ' + err.message);
    }
  }
}
