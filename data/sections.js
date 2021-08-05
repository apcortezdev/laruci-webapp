import Section from '../models/section';
import dbConnect from '../utils/dbConnect';

export async function getSections() {
  let sections = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    sections = await Section.find();
  } catch (err) {
    if (err) {
      throw new Error('ERN002');
    }
  }
  return sections;
}

export async function getSectionsJSON() {
  let sections = await getSections();
  return JSON.stringify(sections);
}

export async function postSection(text) {
  let name = text;

  name = name
    .replace(/[ã|á|à]/gi, 'a')
    .replace(/[é|è]/gi, 'e')
    .replace(/[í|ì]/gi, 'i')
    .replace(/[õ|ó|ò]/gi, 'o')
    .replace(/[ú|ù]/gi, 'u')
    .replace(/[ç]/gi, 'c')
    .replace(/[-|_]/, '')
    .replace(/[ ]+/g, '');

  const newSection = new Section({
    name: name.toLowerCase(),
    text: text.toLowerCase(),
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const created = newSection.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN003');
    }
  }
}

export async function deleteSection(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const deleted = await Section.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      console.log(err);
      throw new Error('ERN004');
    }
  }
}

export async function putSection(_id, text) {
  let name = text;

  name = name
    .replace(/[ã|á|à]/gi, 'a')
    .replace(/[é|è]/gi, 'e')
    .replace(/[í|ì]/gi, 'i')
    .replace(/[õ|ó|ò]/gi, 'o')
    .replace(/[ú|ù]/gi, 'u')
    .replace(/[ç]/gi, 'c')
    .replace(/[-|_]/, '')
    .replace(/[ ]+/g, '');

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const updated = await Section.findByIdAndUpdate(
      _id,
      { name: name.toLowerCase(), text: text.toLowerCase() },
      {
        new: true,
        lean: true,
      }
    );
    return updated;
  } catch (err) {
    if (err) {
      throw new Error('ERN005');
    }
  }
}
