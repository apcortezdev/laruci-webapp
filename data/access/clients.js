import Client from '../../models/client';
import dbConnect from '../../utils/dbConnect';
import { hash } from 'bcryptjs';
import {
  validateEmail,
  validateCPF,
  validateIsFullName,
  validateIsValidName,
  validatePhone,
  validatePasswordLength,
  validatePasswordStrength,
} from '../../validation/backValidation';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const validate = ({ name, email, cpf, phone, password, passwordConf }) => {
  const result = {
    isValid: true,
    client: { name, email, cpf, phone, password, passwordConf },
    error: '',
  };

  // validate name
  if (name.length <= 0 || !validateIsValidName(name)) {
    result.error = 'Invalid name';
  } else if (!validateIsFullName(name)) {
    result.error = 'Not a full name';
  }
  if (result.error.length > 0) {
    result.isValid = false;
    return result;
  }

  // validate email
  if (email.length <= 0 || !validateEmail(email)) {
    result.error = 'Invalid email';
    result.isValid = false;
    return result;
  }

  // validate CPF
  if (cpf.length <= 0 || !validateCPF(cpf)) {
    result.error = 'Invalid cpf';
    result.isValid = false;
    return result;
  }

  // validate phone
  if (!validatePhone(phone)) {
    result.error = 'Invalid phone';
    result.isValid = false;
    return result;
  }

  // validate password
  if (!validatePasswordLength(password)) {
    result.error = 'Password too short';
  } else if (!validatePasswordStrength(password)) {
    result.error = 'Password too week';
  }
  if (result.error.length > 0) {
    result.isValid = false;
    return result;
  }

  // validate password confirmation
  if (password !== passwordConf) {
    result.error = "Password and Password Confirmation don't match";
    result.isValid = false;
    return result;
  }

  return result;
};

export async function postClient(client) {
  const validation = validate(client);
  let newClient;

  if (validation.isValid) {
    newClient = new Client({
      name: validation.client.name,
      email: validation.client.email,
      cpf: validation.client.cpf,
      phone: validation.client.phone,
      hashPassword: await hashPassword(validation.client.password),
    });
  } else {
    throw new Error('ERNC01: Invalid - ' + validation.error);
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC02: ' + err.message);
  }

  try {
    const exists = await Client.findOne().byEmail(validation.client.email);
    if (exists) {
      throw new Error('DUPLICATED');
    }
    const created = await newClient.save();
    return created;
  } catch (err) {
    if (err.message.startsWith('DUPLICATED')) {
      throw new Error('DUPLICATED');
    } else {
      throw new Error('ERNC03: ' + err.message);
    }
  }
}

export async function getSigninClientByEmail(email) {
  return await getClientByEmail(email, 'name email cpf phone hashPassword');
}

export async function getClientInfoByEmail(email) {
  return await getClientByEmail(email, 'name email cpf phone');
}

async function getClientByEmail(email, select) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC04: ' + err.message);
  }

  try {
    const client = await Client.findOne().byEmail(email).select(select);
    return client;
  } catch (err) {
    throw new Error('ERNC05: ' + err.message);
  }
}

export async function logClient(_id, log) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC06: ' + err.message);
  }

  try {
    const logged = await Client.findByIdAndUpdate(_id, {
      $push: {
        accessLogs: {
          ...log,
        },
      },
    });
    return !!logged;
  } catch (err) {
    console.log(err);
    throw new Error('ERNC07: ' + err.message);
  }
}
