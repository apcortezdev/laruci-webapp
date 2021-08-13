import Product from '../models/product';
import { validateProduct } from '../helpers/validation';
import dbConnect from '../utils/dbConnect';

const dummy = {
  abcde: {
    id: 'abcde',
    name: 'Produto 01',
    limitStock: true,
    stockNumber: 50,
    category: 'conjuntos',
    price: 19.99,
    discountPercent: 10,
    weight: 0.5,
    shortDescription: 'Lindo sutiã com bojo meia taça',
    longDescription:
      'Lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha.',
    relatedProducts: ['abcde'],
    sets: {
      '#F1F4C4': {
        colorId: 'vdrF1F4C4',
        colorName: 'Vidro',
        uniqueSizes: [
          { id: 'M', value: 'M', sizeCm: '5' },
          { id: 'G', value: 'G', sizeCm: '5' },
          { id: 'XG', value: 'XG', sizeCm: '5' },
        ],
        specialSizes: [
          {
            id: 'alcas',
            name: 'alças',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            id: 'bojo',
            name: 'bojo',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            id: 'base',
            name: 'base',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            id: 'cintura',
            name: 'cintura',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1590474176361-3360c446dd02?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=771&q=80',
          'https://images.unsplash.com/photo-1592318291025-35d8b8e42ed1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1954&q=80',
          'https://images.unsplash.com/photo-1575186083127-03641b958f61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2002&q=80',
        ],
        extraOptions: [
          {
            name: 'bojo',
            options: [
              {
                name: 'bolha',
                available: true,
              },
              {
                name: 'liso',
                available: true,
              },
            ],
          },
          {
            name: 'cheiro',
            options: [
              {
                name: 'rosas',
                available: true,
              },
              {
                name: 'peido',
                available: false,
              },
            ],
          },
        ],
      },
      '#ea4335': {
        colorId: 'arrea4335',
        colorName: 'Arruaça',
        uniqueSizes: [
          { id: 'M', value: 'M', sizeCm: '5' },
          { id: 'XG', value: 'XG', sizeCm: '5' },
        ],
        specialSizes: [
          {
            id: 'alcas',
            name: 'alças',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            id: 'bojo',
            name: 'bojo',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            id: 'base',
            name: 'base',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            id: 'cintura',
            name: 'cintura',
            sizes: [
              { id: 'M', value: 'M', sizeCm: '5' },
              { id: 'G', value: 'G', sizeCm: '5' },
              { id: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1583900985737-6d0495555783?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=700&q=80',
          'https://images.unsplash.com/photo-1590474272631-0d50f6b8bf9d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
        ],
        extraOptions: [
          {
            name: 'bojo',
            options: [
              {
                name: 'bolha',
                available: true,
              },
              {
                name: 'liso',
                available: true,
              },
            ],
          },
        ],
      },
    },
  },
  efghi: {
    name: 'Produto 02',
    inStock: true,
    category: 'conjuntos',
    price: 89.9,
    discountPercent: 0,
    weight: 0.5,
    shortDescription: 'Lindo sutiã com bojo meia taça',
    longDescription:
      'Lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha.',
    relatedProducts: ['abcde'],
    sets: {
      '#F1F4C4': {
        uniqueSizes: [
          { name: 'M', value: 'M', sizeCm: '5' },
          { name: 'G', value: 'G', sizeCm: '5' },
          { name: 'XG', value: 'XG', sizeCm: '5' },
        ],
        specialSizes: [
          {
            name: 'alças',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'bojo',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'base',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'cintura',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1574539602047-548bf9557352?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=401&q=80',
          'https://images.unsplash.com/photo-1575186083127-03641b958f61?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=401&q=80',
        ],
        extraOptions: [
          {
            name: 'bojo',
            options: [
              {
                name: 'bolha',
                available: true,
              },
              {
                name: 'liso',
                available: true,
              },
            ],
          },
        ],
      },
    },
  },
  ijklm: {
    name: 'Produto 03',
    inStock: true,
    category: 'conjuntos',
    price: 33.33,
    discountPercent: 0,
    weight: 0.5,
    shortDescription: 'Lindo sutiã com bojo meia taça',
    longDescription:
      'Lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha.',
    relatedProducts: ['abcde'],
    sets: {
      '#F1F4C4': {
        uniqueSizes: [
          { name: 'M', value: 'M', sizeCm: '5' },
          { name: 'G', value: 'G', sizeCm: '5' },
        ],
        specialSizes: [
          {
            name: 'alças',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'bojo',
            sizes: [
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'base',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'cintura',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1623039497026-00af61471107?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=80',
          'https://images.unsplash.com/photo-1623039497055-e79fcaebd4ce?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=80',
        ],
        extraOptions: [
          {
            name: 'bojo',
            options: [
              {
                name: 'bolha',
                available: true,
              },
              {
                name: 'liso',
                available: true,
              },
            ],
          },
        ],
      },
    },
  },
  jklmn: {
    name: 'Produto 04',
    inStock: true,
    category: 'conjuntos',
    price: 44.44,
    discountPercent: 0,
    weight: 0.5,
    shortDescription: 'Lindo sutiã com bojo meia taça',
    longDescription:
      'Lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha.',
    relatedProducts: ['abcde'],
    sets: {
      '#F1F4C4': {
        uniqueSizes: [
          { name: 'M', value: 'M', sizeCm: '5' },
          { name: 'G', value: 'G', sizeCm: '5' },
          { name: 'XG', value: 'XG', sizeCm: '5' },
        ],
        specialSizes: [
          {
            name: 'alças',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'bojo',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'base',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'cintura',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1589672554645-662258bdc332?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=334&q=80',
        ],
        extraOptions: [
          {
            name: 'bojo',
            options: [
              {
                name: 'bolha',
                available: true,
              },
              {
                name: 'liso',
                available: true,
              },
            ],
          },
        ],
      },
    },
  },
  nopqr: {
    name: 'Produto 05',
    inStock: true,
    category: 'conjuntos',
    price: 55.55,
    discountPercent: 0,
    weight: 0.5,
    shortDescription: 'Lindo sutiã com bojo meia taça',
    longDescription:
      'Lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha. Llindo sutiã com bojo meia taça com ou sem bolha lindo sutiã com bojo meia taça com ou sem bolha.',
    relatedProducts: ['abcde'],
    sets: {
      '#F1F4C4': {
        uniqueSizes: [
          { name: 'M', value: 'M', sizeCm: '5' },
          { name: 'G', value: 'G', sizeCm: '5' },
          { name: 'XG', value: 'XG', sizeCm: '5' },
        ],
        specialSizes: [
          {
            name: 'alças',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'bojo',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'base',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
          {
            name: 'cintura',
            sizes: [
              { name: 'M', value: 'M', sizeCm: '5' },
              { name: 'G', value: 'G', sizeCm: '5' },
              { name: 'XG', value: 'XG', sizeCm: '5' },
            ],
          },
        ],
        images: [
          'https://images.unsplash.com/photo-1571348635303-dabc89cff3be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1558&q=80',
        ],
        extraOptions: [
          {
            name: 'bojo',
            options: [
              {
                name: 'bolha',
                available: true,
              },
              {
                name: 'liso',
                available: true,
              },
            ],
          },
        ],
      },
    },
  },
};

async function getProductsForListing(products) {
  let productsForListing = {};

  // if (!Array.isArray(products)) {
  for (const key in products) {
    if (Object.hasOwnProperty.call(products, key)) {
      const element = products[key];
      productsForListing[key] = {
        name: element.name,
        category: element.category,
        discountPercent: element.discountPercent,
        price: element.price,
        shortDescription: element.shortDescription,
        images: [],
      };
      for (const set in element.sets) {
        if (Object.hasOwnProperty.call(element.sets, set)) {
          const elementSet = element.sets[set];
          productsForListing[key].images.push({
            color: set,
            image: elementSet.images[0],
          });
        }
      }
    }
  }

  return productsForListing;
}

export async function getCompleteProductById(id) {
  return dummy[Object.keys(dummy)[0]];
  // return dummy[id];
}

export async function getCompleteProductListById(list) {}

export async function getBareProductListById(list) {
  return await getProductsForListing(dummy);
}

export async function getBareProductListByCategory(category) {
  // filter products by category
  return await getProductsForListing(dummy);
}

export async function getProductImageThumb(productId) {
  // returns tumb image for BagPage so it won't have to save link in cookie
  const res = {
    abcde:
      'https://images.unsplash.com/photo-1590474176361-3360c446dd02?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=771&q=80',
  };
  return res;
}

// export async function getCategories() {
//   let categories = [];

//   try {
//     await dbConnect();
//   } catch (err) {
//     throw new Error('ERN001');
//   }

//   try {
//     categories = await Category.find();
//   } catch (err) {
//     if (err) {
//       throw new Error('ERN002');
//     }
//   }
//   return categories;
// }

// export async function getCategoriesJSON() {
//   let categories = await getCategories();
//   return JSON.stringify(categories);
// }

// export async function deleteCategory(_id) {
//   try {
//     await dbConnect();
//   } catch (err) {
//     throw new Error('ERN001');
//   }

//   try {
//     const deleted = await Category.findByIdAndDelete(_id);
//     return deleted;
//   } catch (err) {
//     if (err) {
//       console.log(err);
//       throw new Error('ERN004');
//     }
//   }
// }

const prepareProduct = (product) => {
  let newProduct = {
    code: product.code.trim(),
    name: product.name.trim(),
    limitStock: product.limitStock,
    stockNumber:product.stockNumber,
    categoryId: product.categoryId,
    sectionId: product.sectionId,
    price:
      typeof product.price === 'number' ? product.price : product.price.trim(),
    discountPercentage:
      typeof product.discountPercentage === 'number'
        ? product.discountPercentage
        : product.discountPercentage.trim() || 0,
    weight:
      typeof product.weight === 'number'
        ? product.weight
        : product.weight.trim(),
    shortDescription: product.shortDescription.trim(),
    longDescription: product.longDescription.trim(),
  };
  let sets = product.sets.map((set) => ({
    ...set,
    sizeSets:
      set.sizeSets.length > 0
        ? set.sizeSets.map((size) => ({
            ...size,
            name: size.name.trim(),
          }))
        : [],
    extraOptions:
      set.extraOptions.length > 0
        ? set.extraOptions.map((opt) => ({
            name: opt.name.trim(),
            options: opt.options.map((o) => o.trim()),
          }))
        : [],
  }));
  newProduct.sets = sets;
  return newProduct;
};

export async function getProductByCode(code) {
  let product;

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    product = await Product.find().byCode(code).exec();
  } catch (err) {
    console.log(err);
    if (err) {
      throw new Error('ERN002');
    }
  }
  return product;
}

export async function postProduct(postProduct) {
  let product = prepareProduct(postProduct);
  const isValid = await validateProduct(product);

  if (isValid === 'OK') {
    throw new Error('INVALID');
  }

  const newProduct = new Product({
    ...product,
    sets: [...product.sets],
  });

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
  }

  try {
    const created = await newProduct.save();
    return created;
  } catch (err) {
    if (err) {
      throw new Error('ERN003');
    }
  }
}

export async function putProduct(id, putProduct) {
  let product = prepareProduct(putProduct);
  const isValid = await validateProduct(product);

  if (isValid === 'OK') {
    throw new Error('INVALID');
  }

  try {
    await dbConnect();
  } catch (err) {
    throw new Error('ERN001');
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
      throw new Error('ERN003');
    }
  }
}
