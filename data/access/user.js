import User from '../../models/user';
import dbConnect from '../../utils/dbConnect';
import { hash } from 'bcryptjs';
import {
  validateEmail,
  validatePasswordLength,
  validatePasswordStrength,
} from '../../validation/backValidation';

const hashPassword = async (password) => {
  return await hash(password, 12);
};

const validate = ({ email, password, passwordConf }) => {
  const result = {
    isValid: true,
    user: { email, password, passwordConf },
    error: '',
  };

  // validate email
  if (email.length <= 0 || !validateEmail(email)) {
    result.error = 'Invalid email';
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

export async function postUser(user) {
  const validation = validate(user);
  let newUser;

  if (validation.isValid) {
    newUser = new User({
      email: validation.user.email,
      hashPassword: await hashPassword(validation.user.password),
    });
  } else {
    throw new Error('ERNU01: Invalid - ' + validation.error);
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNU02: ' + err.message);
  }

  try {
    const exists = await getUserByEmail(validation.user.email);
    if (exists) {
      throw new Error('DUPLICATED');
    }
    const created = await newUser.save();
    return created;
  } catch (err) {
    if (err.message.startsWith('DUPLICATED')) {
      throw new Error('DUPLICATED');
    } else {
      throw new Error('ERNU03: ' + err.message);
    }
  }
}

export async function getSigninUserByEmail(email) {
    return await getUserByEmail(email, 'email hashPassword');
  }
  
  export async function getUserInfoByEmail(email) {
    return await getUserByEmail(email, 'name');
  }

async function getUserByEmail(email, select) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNU04: ' + err.message);
  }

  try {
    const user = await User.findOne().byEmail(email).select(select);
    return user;
  } catch (err) {
    throw new Error('ERNU05: ' + err.message);
  }
}

export async function logUser(_id, log) {
    try {
      await dbConnect();
    } catch (err) {
      throw new Error('ERNC06: ' + err.message);
    }
  
    try {
      const logged = await User.findByIdAndUpdate(_id, {
        $push: {
          accessLogs: {
            ...log,
          },
        },
      });
      console.log(logged);
      return true;
    } catch (err) {
      console.log(err)
      throw new Error('ERNC07: ' + err.message);
    }
  }
