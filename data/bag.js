import mongoose from 'mongoose';
import Bag from '../models/bag';
import Product from '../models/product';
import dbConnect from '../utils/dbConnect';

// ERRORS TYPE: ERN0B

export async function postBag(bag) {
  const user = bag.user;
  const location = bag.location;
  const items = bag.items;

  const newBag = new Bag({
    user: user,
    location: location,
    items: items,
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0B1: ' + err.message);
  }

  try {
    const created = await newBag.save();
    return created;
  } catch (err) {
    throw new Error('ERN0B2: ' + err.message);
  }
}

export async function getBagById(id) {
  let bag;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0B3: ' + err.message);
  }

  try {
    bag = await Bag.findById(id)
      .populate({ path: 'items.product', model: Product })
      .populate({
        path: 'items.product',
        populate: { path: 'sets.colorId', model: 'Color' },
      });
  } catch (err) {
    if (err) {
      throw new Error('ERN0B4: ' + err.message);
    }
  }
  return bag;
}

export async function getBagItems(id) {
  let bag;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0B3: ' + err.message);
  }

  try {
    bag = await Bag.aggregate([
      // find bag by _id
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      // spread items from bag
      { $unwind: '$items' },
      // left join to products in every item
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'items.product',
        },
      },
      // take product out of array (array will have one item only)
      { $unwind: '$items.product' },
      // spreat product.sets duplicating the item
      { $unwind: '$items.product.sets' },
      // exclude items where the set is not equal to selectedSet
      {
        $match: {
          $expr: {
            $eq: [
              { $toString: '$items.product.sets._id' },
              { $toString: '$items.selectedSet' },
            ],
          },
        },
      },
      // left join to colors in every item.product.set
      {
        $lookup: {
          from: 'colors',
          localField: 'items.product.sets.colorId',
          foreignField: '_id',
          as: 'items.product.sets.colorId',
        },
      },
      // remove color from array (array will have one item only)
      { $unwind: '$items.product.sets.colorId' },
      // project all to new fields
      {
        $project: {
          _id: '$_id',
          product_name: '$items.product.name',
          price: '$items.product.price',
          discountPercentage: '$items.product.discountPercentage',
          weight: '$items.product.weight',
          // concat image to pattern [pdoructId]/[imageName]
          image: { $concat: [{ $toString: '$items.product._id' }, '/', { $first: '$items.product.sets.images'}]},
          color_name: '$items.product.sets.colorId.text',
          quantity: '$items.quantity',
          extras: '$items.product.sets.extraOptions',
          selectededExtras: '$items.selectedExtras',
          selectedSizes: { $map: { input: '$items.selectedSizes', as: 'size', in: {
            name: { 
              // $getField: {
                // field: 'name',
                // input: {
                  $first: {
                    $filter: { input: '$items.product.sets.sizeSets', as: 'item', cond: { $eq: [
                      { $toString: '$$size.sizeId' },
                      { $toString: '$$item._id' },
                      ]} 
                    }
                  }
                // },
              // }
            },
            selected: '$$size.selected',
           }}},
           selectedExtras: { $map: { input: '$items.selectedExtras', as: 'extra', in: {
            name: { 
              // $getField: {
                // field: 'name',
                // input: {
                  $first: {
                    $filter: { input: '$items.product.sets.extraOptions', as: 'item', cond: { $eq: [
                      { $toString: '$$extra.extraId' },
                      { $toString: '$$item._id' },
                      ]} 
                    }
                  }
                // },
              // }
            },
            selected: '$$extra.selected',
           }}}
        },
      },
    ]);
  } catch (err) {
    if (err) {
      throw new Error('ERN0B4: ' + err.message);
    }
  }
  return bag;
}

export async function addToBag(_id, item) {
  let bag;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    bag = await getBagById(_id);
  } catch (err) {
    throw new Error('NOT FOUND');
  }

  if (!bag) {
    throw new Error('NOT FOUND');
  }

  try {
    let itemToAdd = {
      product: item.product,
      selectedSet: item.selectedSet,
      selectedSizes: item.selectedSizes.map((size) => ({
        sizeId: size.sizeId,
        selected: size.selected,
      })),
      selectedExtras: item.selectedExtras,
    };

    const itemFromDb = bag.items.findIndex((i) => {
      let itemFD = {
        product: i.product._id,
        selectedSet: i.selectedSet,
        selectedSizes: i.selectedSizes.map((size) => ({
          sizeId: size.sizeId,
          selected: size.selected,
        })),
        selectedExtras: i.selectedExtras.map((extra) => ({
          extraId: extra.extraId,
          selected: extra.selected,
        })),
      };
      return JSON.stringify(itemToAdd) === JSON.stringify(itemFD);
    });

    if (itemFromDb < 0) {
      // new Item
      itemToAdd.quantity = item.quantity;
      bag.items.push(itemToAdd);
    } else {
      // add to qty
      itemToAdd.quantity = item.quantity + bag.items[itemFromDb].quantity;
      bag.items[itemFromDb] = itemToAdd;
    }

    const updated = await Bag.findByIdAndUpdate(
      _id,
      { items: bag.items },
      {
        new: true,
        lean: true,
      }
    );
    return updated;
  } catch (err) {
    if (err) {
      throw new Error('ERN005: ' + err.message);
    }
  }
}

export async function deleteFromBag(_id, item) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    const deleted = await Category.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      throw new Error('ERN004: ' + err.message);
    }
  }
}

export async function deleteBag(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001: ' + err.message);
  }

  try {
    const deleted = await Category.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      throw new Error('ERN004: ' + err.message);
    }
  }
}
