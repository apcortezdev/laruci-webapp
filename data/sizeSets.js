import SizeSet from '../models/sizeSet';
import dbConnect from '../utils/dbConnect';

// ERROR TYPE: ERN0SXX
export async function getSizeSetById(_id) {
  let sizeSet;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0S1');
  }

  try {
    sizeSet = await SizeSet.findById(_id);
  } catch (err) {
    if (err) {
      throw new Error('ERN0S2');
    }
  }
  return sizeSet;
}

export async function getSizeSets() {
  let sizeSets = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0S3');
  }

  try {
    sizeSets = await SizeSet.find();
  } catch (err) {
    if (err) {
      throw new Error('ERN0S4');
    }
  }
  return sizeSets;
}

export async function getMainSizeSets() {
  let sizeSets = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0S5');
  }

  try {
    sizeSets = await SizeSet.find().findMain().exec();;
  } catch (err) {
    if (err) {
      throw new Error('ERN0S6');
    }
  }
  return sizeSets;
}

export async function getMainSizeSetsJSON() {
  let sizeSet = await getMainSizeSets();
  return JSON.stringify(sizeSet);
}

export async function getSizeSetsJSON() {
  let sizeSets = await getSizeSets();
  return JSON.stringify(sizeSets);
}

export async function postSizeSet(name, sizes) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0S7');
  }

  try {;
    const newSizeSet = new SizeSet({
      name: name.toLowerCase(),
      sizes: sizes,
    });
    const created = await newSizeSet.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN0S9');
    }
  }
}

export async function deleteSizeSet(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0S10');
  }

  try {
    const deleted = await SizeSet.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      console.log(err);
      throw new Error('ERN0S11');
    }
  }
}

export async function putSizeSet(_id, name, sizes) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0S12');
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
      throw new Error('ERN0S13');
    }
  }
}
