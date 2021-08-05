import Color from '../models/color';
import dbConnect from '../utils/dbConnect';

export async function getColors() {
  let colors = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    colors = await Color.find();
  } catch (err) {
    if (err) {
      throw new Error('ERN002');
    }
  }
  return colors;
}

export async function getColorsJSON() {
  let colors = await getColors();
  return JSON.stringify(colors);
}

export async function postColor(text, code) {
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

  const newColor = new Color({
    name: name.toLowerCase(),
    text: text.toLowerCase(),
    code: code.toLowerCase(),
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const created = newColor.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN003');
    }
  }
}

export async function deleteColor(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const deleted = await Color.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      console.log(err);
      throw new Error('ERN004');
    }
  }
}

export async function putColor(_id, text, code) {
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
    const updated = await Color.findByIdAndUpdate(
      _id,
      {
        name: name.toLowerCase(),
        text: text.toLowerCase(),
        code: code.toLowerCase(),
      },
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
