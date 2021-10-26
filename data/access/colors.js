import Color from '../../models/color';
import dbConnect from '../../utils/dbConnect';

export async function getColorById(_id) {
  let color;
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC01');
  }

  try {
    color = await Color.findById(_id);
  } catch (err) {
    if (err) {
      throw new Error('ERNC02');
    }
  }
  return color;
}

export async function getColors() {
  let colors = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC03');
  }

  try {
    colors = await Color.find();
  } catch (err) {
    if (err) {
      throw new Error('ERNC04');
    }
  }
  return colors;
}

export async function postColor(name, code) {
  const newColor = new Color({
    name: name.toLowerCase(),
    code: code.toLowerCase(),
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC05');
  }

  try {
    const created = await newColor.save();
    return created;
  } catch (err) {
    console.log(err);
    throw new Error('ERNC06');
  }
}

export async function deleteColor(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC07');
  }

  try {
    const deleted = await Color.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      console.log(err);
      throw new Error('ERNC08');
    }
  }
}

export async function putColor(_id, name, code) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNC09');
  }

  try {
    const updated = await Color.findByIdAndUpdate(
      _id,
      {
        name: name.toLowerCase(),
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
      throw new Error('ERNC10');
    }
  }
}
