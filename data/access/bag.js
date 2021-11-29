import mongoose from 'mongoose';
import Bag from '../../models/bag';
import Product from '../../models/product';
import dbConnect from '../../utils/dbConnect';
import { getClientInfoByEmail } from './clients';

export async function getBagById(id) {
  if (!id) return null;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNB03: ' + err.message);
  }

  try {
    const bag = await Bag.findById(id).populate({
      path: 'items.product',
      model: Product,
    });
    return bag;
  } catch (err) {
    throw new Error('ERNB04: ' + err.message);
  }
}

export async function getBagItems(id, clientEmail = null) {
  if (!id) return [];

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNB05: ' + err.message);
  }

  try {
    const bag = await Bag.aggregate([
      // find bag by _id
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $match: { clientEmail: clientEmail } },
      // spread items from bag
      { $unwind: '$items' },
      // left join to products in every item
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'items.productId',
        },
      },
      // take product out of array (array will have one item only)
      { $unwind: '$items.productId' },
      // spreat product.sets duplicating the item
      { $unwind: '$items.productId.sets' },
      // exclude items where the set is not equal to selectedSet
      {
        $match: {
          $expr: {
            $eq: [
              { $toString: '$items.productId.sets._id' },
              { $toString: '$items.selectedSet' },
            ],
          },
        },
      },
      // project all to new fields
      {
        $project: {
          _id: '$items._id',
          productName: '$items.productId.name',
          productId: '$items.productId._id',
          price: '$items.productId.price',
          discountPercentage: '$items.productId.discountPercentage',
          weight: '$items.productId.weight',
          // concat image to pattern [pdoructId]/[imageName]
          image: {
            $concat: [
              { $toString: '$items.productId._id' },
              '/',
              { $first: '$items.productId.sets.images' },
            ],
          },
          colorName: '$items.productId.sets.colorName',
          quantity: '$items.quantity',
          selectedSet: '$items.selectedSet',
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
                      input: '$items.productId.sets.sizeSets',
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
                selected: '$$size',
                // selected: '$$size.sizeId',
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
                      input: '$items.productId.sets.extraOptions',
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
    return bag;
  } catch (err) {
    throw new Error('ERNB06: ' + err.message);
  }
}

export async function postBag(newBag, clientEmail) {
  if (!newBag || !newBag.items?.length) return null;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNB01: ' + err.message);
  }

  try {
    let savedBag;
    let client = null;
    if (clientEmail) client = await getClientInfoByEmail(clientEmail);

    if (newBag.id) {
      savedBag = await Bag.findByIdAndUpdate(
        newBag.id,
        { client, clientEmail: client?.email || null, ...newBag },
        {
          new: true,
          lean: true,
        }
      );
    } else {
      const created = new Bag({
        client,
        clientEmail: client?.email || null,
        ...newBag,
      });
      savedBag = await created.save();
    }

    return savedBag;
  } catch (err) {
    console.log(err);
    throw new Error('ERNB02: ' + err.message);
  }
}

export async function deleteBag(_id) {
  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERNB09: ' + err.message);
  }

  try {
    const deleted = await Bag.findByIdAndDelete(_id);
    return deleted;
  } catch (err) {
    throw new Error('ERNB10: ' + err.message);
  }
}
