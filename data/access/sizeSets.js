import SizeSet from '../../models/sizeSet';
import dbConnect from '../../utils/dbConnect';

export async function getSizeSetById(_id) {
  let sizeSet;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNS01');
  }

  try {
    sizeSet = await SizeSet.findById(_id);
  } catch (err) {
    if (err) {
      throw new Error('ERNS02');
    }
  }
  return sizeSet;
}

export async function getSizeSets() {
  let sizeSets = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNS03');
  }

  try {
    sizeSets = await SizeSet.find();
  } catch (err) {
    if (err) {
      throw new Error('ERNS04');
    }
  }
  return sizeSets;
}

export async function getMainSizeSets() {
  let sizeSets = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNS05');
  }

  try {
    sizeSets = await SizeSet.find().findMain().exec();
  } catch (err) {
    if (err) {
      throw new Error('ERNS06');
    }
  }
  return sizeSets;
}

export async function postSizeSet(name, sizes) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNS07');
  }

  try {
    const newSizeSet = new SizeSet({
      name: name.toLowerCase(),
      sizes: sizes,
    });
    const created = await newSizeSet.save();
    return created;
  } catch (err) {
    console.log(err);
    throw new Error('ERNS08');
  }
}

export async function deleteSizeSet(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNS09');
  }

  try {
    const deleted = await SizeSet.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      console.log(err);
      throw new Error('ERNS10');
    }
  }
}

export async function putSizeSet(_id, name, sizes) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNS11');
  }

  try {
    const updated = await SizeSet.findByIdAndUpdate(
      _id,
      { name: name.toLowerCase(), sizes: sizes },
      {
        new: true,
        lean: true,
      }
    );
    return updated;
  } catch (err) {
    if (err) {
      throw new Error('ERNS12');
    }
  }
}
