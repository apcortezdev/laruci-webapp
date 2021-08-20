import Product from '../models/product';
import Color from '../models/color';
import Category from '../models/category';
import dbConnect from '../utils/dbConnect';
import sizeSet from '../models/sizeSet';

export async function getProductIdsByCategory(categoryId, page, numPerPage) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    product = await Product.find().byCategory(categoryId).select('_id').exec();
  } catch (err) {
    if (err) {
      throw new Error('ERN002: ' + err.message);
    }
  }
  return product;
}

export async function getProductIdsByCategoryJSON(
  categoryId,
  page,
  numPerPage
) {
  const list = await getProductIdsByCategory(categoryId, page, numPerPage);
  return JSON.stringify(list);
}

export async function getProductById(id) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    // product = await Product.findById(id).populate({ path: 'sectionId', model: Section });
    product = await Product.findById(id)
      .populate({ path: 'categoryId', model: Category })
      .populate({ path: 'sets.colorId', model: Color })
      .populate({ path: 'sets.sizeSets.sizeSetId', model: sizeSet });
  } catch (err) {
    if (err) {
      throw new Error('ERN002: ' + err.message);
    }
  }
  return product;
}

export async function getProductByIdJSON(id) {
  const product = await getProductById(id);
  return JSON.stringify(product);
}

export async function getProductListingByCategory(
  categoryId,
  page,
  numPerPage
) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    const result = await Product.find()
      .byCategory(categoryId)
      .select('_id name price discountPercentage shortDescription sets')
      .populate('categoryId')
      .populate('sets.colorId')
      .exec();
    product = result.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      categoryName: p.categoryId.name,
      discountPercentage: p.discountPercentage,
      shortDescription: p.shortDescription,
      image: p.sets[0].images[0],
    }));
  } catch (err) {
    if (err) {
      throw new Error('ERN002: ' + err.message);
    }
  }
  return product;
}

export async function getProductListingByCategoryJSON(
  categoryId,
  page,
  numPerPage
) {
  const list = await getProductListingByCategory(categoryId, page, numPerPage);
  return JSON.stringify(list);
}

export async function getProductByCode(code) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    product = await Product.find().byCode(code).exec();
  } catch (err) {
    if (err) {
      throw new Error('ERN002: ' + err.message);
    }
  }
  return product;
}

export async function postProduct(product) {
  const newProduct = new Product({
    ...product,
    sets: [...product.sets],
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    const created = await newProduct.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN003: ' + err.message);
    }
  }
}

export async function deleteProduct(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    const deleted = await Product.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      throw new Error('ERN004: ' + err.message);
    }
  }
}

async function putProduct(id, putProduct) {
  let product = prepareProduct(putProduct);
  const isValid = await validateProduct(product);

  if (isValid === 'OK') {
    throw new Error('INVALID');
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { ...product, sets: [...product.sets] },
      {
        new: true,
        lean: true,
      }
    );
    return updated;
  } catch (err) {
    if (err) {
      throw new Error('ERN003: ' + err.message);
    }
  }
}
