import Product from '../models/product';
import Color from '../models/color';
import Category from '../models/category';
import dbConnect from '../utils/dbConnect';
import sizeSet from '../models/sizeSet';
import mongoose from 'mongoose';

export async function getProductIdsByCategory(categoryId, page, numPerPage) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P1: ' + err.message);
  }

  try {
    product = await Product.find().byCategory(categoryId).select('_id').exec();
  } catch (err) {
    if (err) {
      throw new Error('ERN0P2: ' + err.message);
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
    throw new Error('ERN0P3: ' + err.message);
  }

  try {
    product = await Product.findById(id).populate({
      path: 'sets.sizeSets.sizeSetId',
      model: sizeSet,
    });
  } catch (err) {
    if (err) {
      throw new Error('ERN0P4: ' + err.message);
    }
  }
  return product;
}

export async function getProductByIdJSON(id) {
  const product = await getProductById(id);
  return JSON.stringify(product);
}

export async function getProductsForSSR() {
  let products;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P5: ' + err.message);
  }

  try {
    products = await Product.find().select('_id categoryName');
  } catch (err) {
    if (err) {
      throw new Error('ERN0P6: ' + err.message);
    }
  }
  return products;
}

export async function getProductListing(
  { category = 0, color = 0, size = 0, order = 0, term = '' },
  page = 1,
  numPerPage = 20
) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P5: ' + err.message);
  }

  try {
    let aggregate = [];
    // selects category
    aggregate.push({
      $match: { categoryId: mongoose.Types.ObjectId(category) },
    });

    //selects color
    if (color != 0 && color !== 'all' && color.length > 0) {
      console.log(color);
      console.log('colored');
      aggregate.push({ $unwind: '$sets' });
      aggregate.push({ $addFields: { color: '$sets.colorId' } });
      aggregate.push({ $match: { color: mongoose.Types.ObjectId(color) } });
    }

    //selects term
    if (term.length > 1) {
      console.log('termed');
      aggregate.push({
        $match: {
          $expr: {
            $or: [
              { name: { $regex: new RegExp(term, 'i') } },
              { categoryName: { $regex: new RegExp(term, 'i') } },
              { shortDescription: { $regex: new RegExp(term, 'i') } },
              { longDescription: { $regex: new RegExp(term, 'i') } },
            ],
          },
        },
      });
    }

    if (color != 0 && color !== 'all' && color.length > 0) {
      aggregate.push({
        $project: {
          _id: '$_id',
          name: '$name',
          price: '$price',
          colorName: '$sets.colorName',
          discountPercentage: '$discountPercentage',
          categoryName: '$categoryName',
          shortDescription: '$shortDescription',
          image: { $first: '$sets.images' },
        },
      });
    } else {
      aggregate.push({
        $project: {
          _id: '$_id',
          name: '$name',
          price: '$price',
          colorName: '$sets.colorName',
          discountPercentage: '$discountPercentage',
          categoryName: '$categoryName',
          shortDescription: '$shortDescription',
          image: { $first: { $first: '$sets.images' } },
        },
      });
    }

    const products = await Product.aggregate(aggregate);
    return products;
  } catch (err) {
    if (err) {
      throw new Error('ERN0P6: ' + err.message);
    }
  }
}

export async function getProductListingJSON(
  { category = 0, color = 0, size = 0, order = 0, term = '' },
  page = 1,
  numPerPage = 20
) {
  const list = await getProductListing(
    {
      category,
      color,
      size,
      order,
      term,
    },
    page,
    numPerPage
  );
  return JSON.stringify(list);
}

export async function getProductByCode(code) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P7: ' + err.message);
  }

  try {
    product = await Product.find().byCode(code).exec();
  } catch (err) {
    if (err) {
      throw new Error('ERN0P8: ' + err.message);
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
    throw new Error('ERN0P9: ' + err.message);
  }

  try {
    const prods = await getProductByCode(product.code);
    if (prods.length > 0) throw new Error('DUPLICATED CODE');
  } catch (err) {
    if (err.message === 'DUPLICATED CODE') throw new Error('DUPLICATED CODE');
    throw new Error('ERN0P10: ' + err.message);
  }

  try {
    const created = await newProduct.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN0P11: ' + err.message);
    }
  }
}

export async function deleteProduct(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0P12: ' + err.message);
  }

  try {
    const deleted = await Product.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      throw new Error('ERN0P13: ' + err.message);
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
    throw new Error('ERN0P14: ' + err.message);
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
      throw new Error('ERN0P15: ' + err.message);
    }
  }
}
