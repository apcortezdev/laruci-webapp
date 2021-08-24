import Bag from '../models/bag';
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

export async function getBagById(_id) {
  let bag;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN0B3: ' + err.message);
  }

  try {
    bag = await Bag.findById(_id);
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
        product: i.product,
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

export async function deleteCategory(_id) {
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
