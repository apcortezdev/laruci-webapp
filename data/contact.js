import Contact from '../models/contact';
import dbConnect from '../utils/dbConnect';

// ERROR TYPE: ERN0C

export async function getMainSocial() {
  let contact;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C1: ' + err.message);
  }

  try {
    contact = await Contact.find()
      .mainSocial()
      .select('facebookName instagramName whatsappNum whatsappMessage');
  } catch (err) {
    if (err) {
      throw new Error('ERN0C2: ' + err.message);
    }
  }
  return contact;
}

export async function getContactById(_id) {
  let contact;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C3: ' + err.message);
  }

  try {
    contact = await Contact.findById(_id);
  } catch (err) {
    if (err) {
      throw new Error('ERN0C4: ' + err.message);
    }
  }
  return contact;
}

export async function getContactByName(name) {
  let contact;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C5: ' + err.message);
  }

  try {
    contact = await Contact.find().byName(name);
  } catch (err) {
    if (err) {
      throw new Error('ERN0C6: ' + err.message);
    }
  }
  return contact;
}

export async function postContact(contact) {
  const newContact = new Contact({
    ...contact,
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C7: ' + err.message);
  }

  try {
    let contact = await getContactByName(newContact.name);
    if (contact.length > 0) {
      throw new Error('DUPLICATED');
    }
    contact = await getContactByText(newContact.text);
    if (contact.length > 0) {
      throw new Error('DUPLICATED');
    }

    const created = await newContact.save();
    return created;
  } catch (err) {
    if (err.message.startsWith('DUPLICATED')) {
      throw new Error('DUPLICATED');
    } else {
      throw new Error('ERN0C8: ' + err.message);
    }
  }
}

export async function deleteContact(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C9: ' + err.message);
  }

  try {
    const deleted = await Contact.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      throw new Error('ERN0C10: ' + err.message);
    }
  }
}

export async function putContact(_id, contact) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0C11: ' + err.message);
  }

  try {
    const updated = await Contact.findByIdAndUpdate(
      _id,
      { ...contact },
      {
        new: true,
        lean: true,
      }
    );
    return updated;
  } catch (err) {
    if (err) {
      throw new Error('ERN0C12: ' + err.message);
    }
  }
}
