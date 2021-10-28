import mongoose from 'mongoose';
import dbConnect from '../../utils/dbConnect';
import Product from '../../models/product';
import sizeSet from '../../models/sizeSet';
import { getCategoryById, getSectionById } from './appInfo';

export async function getProductById(id) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNP01: ' + err.message);
  }

  try {
    product = await Product.findById(id).populate({
      path: 'sets.sizeSets.sizeSetId',
      model: sizeSet,
    });
  } catch (err) {
    if (err) {
      throw new Error('ERNP02: ' + err.message);
    }
  }
  return product;
}

export async function getProductsForSSR() {
  let products;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNP03: ' + err.message);
  }

  try {
    products = await Product.find().select('_id categoryName');
  } catch (err) {
    if (err) {
      throw new Error('ERNP04: ' + err.message);
    }
  }
  return products;
}

export async function getProductListing(
  { category = 0, color = 0, section = 0, order = 0, term = '' },
  page = 1,
  numPerPage = 20
) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNP05: ' + err.message);
  }

  try {
    let aggregate = [];

    if (numPerPage <= 0) {
      return [];
    }

    // selects category
    if (category !== 'all' && category.length > 0) {
      const cat = await getCategoryById(parseInt(category));
      aggregate.push({
        $match: { categoryName: cat.name },
      });
    }

    // selects section
    if (section !== 'all' && section.length > 0) {
      const sec = await getSectionById(parseInt(section));
      aggregate.push({
        $match: { sectionName: sec.name },
      });
    }

    // selects color
    if (color != 0 && color !== 'all' && color.length > 0) {
      aggregate.push({ $unwind: '$sets' });
      aggregate.push({ $addFields: { color: '$sets.colorId' } });
      aggregate.push({ $match: { color: mongoose.Types.ObjectId(color) } });
    }

    // selects term
    if (term.length > 1) {
      aggregate.push({
        $match: {
          $or: [
            { name: { $regex: term, $options: 'i' } },
            { categoryName: { $regex: term, $options: 'i' } },
            { sectionName: { $regex: term, $options: 'i' } },
            { shortDescription: { $regex: term, $options: 'i' } },
            { longDescription: { $regex: term, $options: 'i' } },
          ],
        },
      });
    }

    // paginate
    if (page > 1) {
      const p = (+page - 1) * +numPerPage;
      aggregate.push({
        $skip: p,
      });
    }

    // sort
    if (order && order != 'all' && order != 0) {
      aggregate.push({
        $sort: { createdOn: -1 },
      });
    }

    // limit to page
    aggregate.push({
      $limit: +numPerPage,
    });

    // projects accordingly
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
    throw new Error('ERNP06: ' + err.message);
  }
}

export async function getProductByCode(code) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNP07: ' + err.message);
  }

  try {
    product = await Product.findOne().byCode(code).exec();
  } catch (err) {
    throw new Error('ERNP08: ' + err.message);
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
    throw new Error('ERNP09: ' + err.message);
  }

  try {
    const prods = await getProductByCode(product.code);
    if (prods?.length > 0) throw new Error('DUPLICATED CODE');
  } catch (err) {
    console.log(err)
    if (err.message === 'DUPLICATED CODE') throw new Error('DUPLICATED CODE');
    throw new Error('ERNP10: ' + err.message);
  }

  try {
    const created = await newProduct.save();
    return created;
  } catch (err) {
    console.log(err)
    throw new Error('ERNP11: ' + err.message);
  }
}

export async function deleteProduct(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNP12: ' + err.message);
  }

  try {
    const deleted = await Product.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    throw new Error('ERNP13: ' + err.message);
  }
}
