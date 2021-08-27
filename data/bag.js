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
    return {
      status: 201,
      bag: created,
    };
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
    bag = await Bag.findById(id).populate({
      path: 'items.product',
      model: Product,
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
    throw new Error('ERN0B5: ' + err.message);
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
      // project all to new fields
      {
        $project: {
          _id: '$items._id',
          product_name: '$items.product.name',
          price: '$items.product.price',
          discountPercentage: '$items.product.discountPercentage',
          weight: '$items.product.weight',
          // concat image to pattern [pdoructId]/[imageName]
          image: {
            $concat: [
              { $toString: '$items.product._id' },
              '/',
              { $first: '$items.product.sets.images' },
            ],
          },
          color_name: '$items.product.sets.colorName',
          quantity: '$items.quantity',
          selectedSizes: {
            $map: {
              input: '$items.selectedSizes',
              as: 'size',
              in: {
                size: {
                  // $getField: {
                  // field: "name",
                  // input: {
                  $first: {
                    $filter: {
                      input: '$items.product.sets.sizeSets',
                      as: 'item',
                      cond: {
                        $eq: [
                          { $toString: '$$size.sizeId' },
                          { $toString: '$$item._id' },
                        ],
                      },
                    },
                  },
                  // },
                  // }
                },
                selected: '$$size.selected',
              },
            },
          },
          selectedExtras: {
            $map: {
              input: '$items.selectedExtras',
              as: 'extra',
              in: {
                option: {
                  // $getField: {
                  // field: "name",
                  // input: {
                  $first: {
                    $filter: {
                      input: '$items.product.sets.extraOptions',
                      as: 'item',
                      cond: {
                        $eq: [
                          { $toString: '$$extra.extraId' },
                          { $toString: '$$item._id' },
                        ],
                      },
                    },
                  },
                  // },
                  // }
                },
                selected: '$$extra.selected',
              },
            },
          },
        },
      },
    ]);
  } catch (err) {
    if (err) {
      throw new Error('ERN0B6: ' + err.message);
    }
  }
  return bag;
}

export async function addOrRemoveFromBag(_id, item) {
  let bag;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0B7: ' + err.message);
  }

  try {
    bag = await getBagById(_id);
  } catch (err) {
    throw new Error('NOT FOUND');
  }

  if (!bag) {
    return {
      status: '404',
      bag: [],
    };
  }

  try {
    if (typeof item.id === 'undefined') {
      // Has no id, detect item by comparing all fields
      let itemToAdd = {
        product: item.product,
        selectedSet: item.selectedSet,
        selectedSizes: item.selectedSizes.map((size) => ({
          sizeId: size.sizeId,
          selected: size.selected,
        })),
        selectedExtras: item.selectedExtras,
      };

      const index = bag.items.findIndex((i) => {
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

      if (index < 0) {
        // Item not found: new Item
        itemToAdd.quantity = item.quantity;
        bag.items.push(itemToAdd);
      } else {
        // item found
        if (item.quantity === -1 * bag.items[index].quantity) {
          // if item.quantity is equal to negative bag.items.quantity, remove item from bag
          bag.items.splice(index, 1);
        } else {
          // if not, add value
          itemToAdd.quantity = item.quantity + bag.items[index].quantity;
          bag.items[index] = itemToAdd;
        }
        // Item found: add to qty
      }
    } else {
      // has item id
      const index = bag.items.findIndex(
        (itm) => itm._id.toString() === item.id.toString()
      );
      if (index >= 0) {
        // item found
        if (item.quantity === -1 * bag.items[index].quantity) {
          // if item.quantity is equal to negative bag.items.quantity, remove item from bag
          bag.items.splice(index, 1);
        } else {
          // if not, add value
          bag.items[index].quantity = bag.items[index].quantity + item.quantity;
        }
      } else {
        // item not found, throw error
        throw new Error('NOT FOUND');
      }
    }

    let result = {};
    if (bag.items.length <= 0) {
      result.status = '204';
      result.bag = await Bag.findByIdAndDelete(_id);
    } else {
      result.status = '201';
      result.bag = await Bag.findByIdAndUpdate(
        _id,
        { items: bag.items },
        {
          new: true,
          lean: true,
        }
      );
    }

    return result;
  } catch (err) {
    if (err) {
      throw new Error('ERN0B8: ' + err.message);
    }
  }
}

export async function deleteBag(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0B9: ' + err.message);
  }

  try {
    const deleted = await Bag.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    if (err) {
      throw new Error('ERN0B10: ' + err.message);
    }
  }
}
