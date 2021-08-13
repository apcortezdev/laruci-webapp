import Category from '../models/category';
import dbConnect from '../utils/dbConnect';

export async function getCategoryById(_id) {

  let category;
  
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    category = await Category.findById(_id);
  } catch (err) {
    console.log(err)
    if (err) {
      throw new Error('ERN002');
    }
  }
  return category;
}

export async function getCategories() {
  let categories = [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    categories = await Category.find();
  } catch (err) {
    if (err) {
      throw new Error('ERN002');
    }
  }
  return categories;
}

export async function getCategoriesJSON() {
  let categories = await getCategories();
  return JSON.stringify(categories);
}

export async function postCategory(text) {
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

  const newCategory = new Category({
    name: name.toLowerCase(),
    text: text.toLowerCase(),
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const created = await newCategory.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN003');
    }
  }
}

export async function deleteCategory(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const deleted = await Category.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      console.log(err);
      throw new Error('ERN004');
    }
  }
}

export async function putCategory(_id, text) {
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
    const updated = await Category.findByIdAndUpdate(
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
