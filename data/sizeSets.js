import SizeSet from '../models/sizeSet';
import dbConnect from '../utils/dbConnect';

export async function getSizeSetById(_id) {
  let sizeSet;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    sizeSet = await SizeSet.findById(_id);
  } catch (err) {
    if (err) {
      throw new Error('ERN002');
    }
  }
  return sizeSet;
}

export async function getSizeSets() {
  let sizeSets = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    sizeSets = await SizeSet.find();
  } catch (err) {
    if (err) {
      throw new Error('ERN002');
    }
  }
  return sizeSets;
}

export async function getSizeSetsJSON() {
  let sizeSets = await getSizeSets();
  return JSON.stringify(sizeSets);
}

export async function postSizeSet(name, sizes) {
  const newSizeSet = new SizeSet({
    name: name.toLowerCase(),
    sizes: sizes,
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const created = newSizeSet.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN003');
    }
  }
}

export async function deleteSizeSet(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const deleted = await SizeSet.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      console.log(err);
      throw new Error('ERN004');
    }
  }
}

export async function putSizeSet(_id, name, sizes) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
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
      throw new Error('ERN005');
    }
  }
}
