import { getCategoryById } from '../data/categories';
import { getSectionById } from '../data/sections';
import { getColorById } from '../data/colors';
import { getSizeSetById } from '../data/sizeSets';
import { getProductByCode } from '../data/products';

const validateNameSlur = (name) => {
  const p =
    /p+[e+|ê+]+n+i+s+|c+a+r+a+l+[h+o+|e+o+|h+u+d+o+|h+u+d+a+]|p+i+c+[a+|ã+o+|u+d+o+]|r+o+l+u+d+[a+|o+]|j+e+b+[a+|ã+o+|u+d+o+]/;
  const v =
    /b+u+c+e+t+[a+|ã+o+|u+d+]|v+i+a+d+o+|p+u+t+[a+|ã+|o+]|v+a+g+i+n+[a+|â+o+|o+n+a+]/;
  const e =
    /f+u+c+k+|s+h+i+t+|t+w+a+t+|p+r+i+c+k+|b+i+t+c+h+|c+o+c+k+|d+i+c+k+/;

  if (p.test(String(name).toLowerCase())) return false;
  if (v.test(String(name).toLowerCase())) return false;
  if (e.test(String(name).toLowerCase())) return false;
  return true;
};

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePasswordSize = (pass) => {
  if (pass.toString().length < 6 || pass.toString().length > 24) {
    return false;
  }
  return true;
};

const validateCPF = (cpf) => {
  const regex = /^(?:(\d)\1{10})$|(\D)|^(\d{12,})$|^(\d{0,10})$/g;
  if (cpf.length !== 11) return false;
  if (cpf.match(regex)) return false;
  return true;
};

const validateProduct = async (product) => {
  // code
  if (product.code.trim().length < 4 || product.code.trim().length > 10)
    return 'INVALID CODE: OUT OF RANGE';
  if (!validateNameSlur(product.code)) return 'INVALID CODE: SLUR';
  let prods;
  try {
    prods = await getProductByCode(product.code);
    if (prods.length > 0) return 'INVALID CODE: DUPLICATED';
  } catch (err) {
    return 'INVALID CODE: DUPLICATED';
  }

  // name
  if (product.name.trim().length < 4 || product.name.trim().length > 25)
    return 'INVALID NAME: OUT OF RANGE';
  if (!validateNameSlur(product.name)) return 'INVALID NAME: SLUR';

  // limitStock / stockNumber
  if (
    typeof product.limitStock !== 'boolean' &&
    typeof product.limitStock !== 'Boolean'
  )
    return 'INVALID LIMIT-STOCK: NOT BOOL';
  if (
    product.limitStock &&
    product.stockNumber.toString().match(/[^0-9]/gi) != null
  )
    return 'INVALID STOCK-NUMBER: NOT A NUMBER';
  if (product.limitStock && +product.stockNumber < 1)
    return 'STOCK-NUMBER LESS THAN 1';

  // price
  if (
    product.price.toString().match(/[^0-9\.]/gi) != null ||
    (product.price.toString().match(/\./g) != null &&
      product.price.toString().match(/\./g).length > 1) ||
    +product.price <= 0
  )
    return 'INVALID PRICE';

  // discountPercentage
  if (
    product.discountPercentage.toString().match(/[^0-9\.]/gi) != null ||
    (product.discountPercentage.toString().match(/\./g) != null &&
      product.discountPercentage.toString().match(/\./g).length > 1) ||
    +product.discountPercentage < 0 ||
    +product.discountPercentage > 100
  )
    return 'INVALID DISCOUNT PERCENTAGE';

  // weight
  if (
    product.weight.toString().match(/[^0-9\.]/gi) != null ||
    (product.weight.toString().match(/\./g) != null &&
      product.weight.toString().match(/\./g).length > 1) ||
    +product.weight <= 0
  )
    return 'INVALID WEIGHT';

  // shortDescription
  if (
    product.shortDescription.trim().length < 5 ||
    product.shortDescription.trim().length > 40
  )
    return 'INVALID SHORT-DESCRIPTION: OUT OF RANGE';
  if (!validateNameSlur(product.shortDescription))
    return 'INVALID SHORT-DESCRIPTION: SLUR';

  // longDescription
  if (
    product.longDescription.trim().length < 50 ||
    product.longDescription.trim().length > 1000
  )
    return 'INVALID LONG-DESCRIPTION: OUT OF RANGE';
  if (!validateNameSlur(product.longDescription))
    return 'INVALID LONG-DESCRIPTION: SLUR';

  // categoryId
  if (product.categoryId.trim().length <= 0)
    return 'INVALID CATEGORY: NO CATEGORY';
  let category;
  try {
    category = await getCategoryById(product.categoryId);
    if (category.length <= 0) return 'INVALID CATEGORY';
  } catch (err) {
    return 'INVALID CATEGORY';
  }
  product.categoryName = category.name;

  // sectionId
  if (product.sectionId.trim().length <= 0)
    return 'INVALID SECTION: NO SECTION';
  let section;
  try {
    section = await getSectionById(product.sectionId);
    if (section.length <= 0) return 'INVALID SECTION';
  } catch (err) {
    return 'INVALID SECTION';
  }

  // sets
  if (product.sets.length <= 0) return 'INVALID SET: NO SETS';
  let isValid = 'OK';
  for (const set of product.sets) {
    //colorId
    if (set.colorId.trim().length <= 0) {
      isValid = 'INVALID SET: NO COLOR';
      break;
    }
    let color;
    try {
      color = await getColorById(set.colorId);
      if (color.length <= 0) {
        isValid = 'INVALID SET: INVALID COLOR';
        break;
      }
    } catch (err) {
      isValid = 'INVALID SET: INVALID COLOR';
      break;
    }
    set.colorName = color.text;
    set.colorCode = color.code;

    // sizeSets
    if (set.sizeSets.length > 0) {
      for (const sizeSet of set.sizeSets) {
        // name
        if (sizeSet.name.trim().length < 2 || sizeSet.name.trim().length > 15) {
          isValid = 'INVALID SIZE-SET NAME: OUT OF RANGE';
          break;
        }
        if (!validateNameSlur(sizeSet.name)) {
          isValid = 'INVALID SIZE-SET NAME: SLUR';
          break;
        }

        // isUnique
        if (
          typeof sizeSet.isUnique !== 'boolean' &&
          typeof sizeSet.isUnique !== 'Boolean'
        ) {
          isValid = 'INVALID SIZE-SET IS-UNIQUE: NOT BOOL';
          break;
        }

        // sizeSetId
        if (sizeSet.sizeSetId.trim().length <= 0) {
          isValid = 'INVALID SIZE-SET SET-ID: NO SET-ID';
          break;
        }
        let sizeSetFromDb;
        try {
          sizeSetFromDb = await getSizeSetById(sizeSet.sizeSetId);
          if (sizeSetFromDb.length <= 0) {
            isValid = 'INVALID SIZE-SET SET-ID';
            break;
          }
        } catch (err) {
          isValid = 'INVALID SIZE-SET SET-ID';
          break;
        }

        // availableSizes
        if (sizeSet.availableSizes.length <= 0) {
          isValid = 'INVALID SIZE-SET AVAILABLE-SIZES: NO AVAILABLE-SIZES';
          break;
        }
        for (const size of sizeSet.availableSizes) {
          if (sizeSetFromDb.sizes.findIndex((s) => s === size) < 0) {
            isValid =
              'INVALID SIZE-SET AVAILABLE-SIZES: INVALID AVAILABLE-SIZES';
            break;
          }
        }
        if (isValid !== 'OK') return;
      }
    }

    //images
    if (set.images.length <= 0) {
      isValid = 'INVALID SIZE-SET IMAGE: NO IMAGE';
      break;
    }

    // extraOptions
    if (set.extraOptions.length > 0) {
      for (const opt of set.extraOptions) {
        // name
        if (opt.name.trim().length < 2 || opt.name.trim().length > 15) {
          isValid = 'INVALID EXTRA-OPTION NAME: OUT OF RANGE';
          break;
        }
        if (!validateNameSlur(opt.name)) {
          isValid = 'INVALID EXTRA-OPTION NAME: SLUR';
          break;
        }

        // options
        if (opt.options.length < 2) {
          isValid = 'INVALID EXTRA-OPTION OPTIONS: LESS THAN 2';
          break;
        }
        for (const op of opt.options) {
          if (op.trim().length < 2 || op.trim().length > 10) {
            isValid = 'INVALID EXTRA-OPTION OPT NAME: OUT OF RANGE';
            break;
          }
          if (!validateNameSlur(op)) {
            isValid = 'INVALID EXTRA-OPTION OPT NAME: SLUR';
            break;
          }
        }
      }
    }

    if (isValid !== 'OK') return;
  }

  return product;
};

export {
  validateNameSlur,
  validateEmail,
  validatePasswordSize,
  validateProduct,
  validateCPF,
};
