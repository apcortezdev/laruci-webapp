import { getCategoryById } from '../data/categories';
import { getSectionById } from '../data/sections';
import { getColorById } from '../data/colors';
import { getSizeSetById } from '../data/sizeSets';

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

const validateIsEmail = (email) => {
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

const validateProduct = async (product) => {
  /*
  EXAMPLE:
    {
      "code": "tg177",
      "name": "Fionna",
      "limitStock": true,
      "stockNumber": 100,
      "categoryId": "610be9170c9efc1504511c7a",
      "sectionId": "610be9b30c9efc1504511c92",
      "price": "89.99",
      "discountPercentage": "5",
      "weight": "0.215",
      "shortDescription": "Lindo conjundo Fionna coleção 2006",
      "longDescription": "Lindo conjundo Fionna coleção 2006\n\n-Lindo conjundo Fionna coleção 2006\n-Lindo Fionna coleção 2006\n-Lindo conjundo Fionna 2006\n-Lindo conjundo coleção 2006\n-Lindo conjundo Fionna coleção ",
      "sets": [
          {
              "colorId": "610ae56a8075a60e4cfde69b",
              "sizeSets": [
                  {
                      "name": "unique",
                      "isUnique": true,
                      "sizeSetId": "610c411d974ca338dc4b76d9",
                      "availableSizes": [
                          "p",
                          "g",
                          "gg",
                          "m"
                      ]
                  },
                  {
                      "name": "Cintura",
                      "isUnique": false,
                      "sizeSetId": "610c411d974ca338dc4b76d9",
                      "availableSizes": [
                          "m",
                          "g",
                          "gg",
                          "xg"
                      ]
                  },
                  {
                      "name": "base",
                      "isUnique": false,
                      "sizeSetId": "610c411d974ca338dc4b76d9",
                      "availableSizes": [
                          "m",
                          "g",
                          "gg",
                          "xg"
                      ]
                  }
              ],
              "images": [],
              "extraOptions": [
                  {
                      "name": "Bojo",
                      "options": [
                          "liso",
                          "bolha"
                      ]
                  },
                  {
                      "name": "strass",
                      "options": [
                          "com",
                          "sem"
                      ]
                  }
              ]
          },
          {
              "colorId": "610be94b0c9efc1504511c86",
              "sizeSets": [
                  {
                      "name": "unique",
                      "isUnique": true,
                      "sizeSetId": "610c411d974ca338dc4b76d9",
                      "availableSizes": [
                          "p",
                          "m",
                          "g",
                          "xg",
                          "gg"
                      ]
                  },
                  {
                      "name": "Cintura",
                      "isUnique": false,
                      "sizeSetId": "610c411d974ca338dc4b76d9",
                      "availableSizes": [
                          "p",
                          "m",
                          "g",
                          "gg",
                          "xg"
                      ]
                  },
                  {
                      "name": "Base",
                      "isUnique": false,
                      "sizeSetId": "610c411d974ca338dc4b76d9",
                      "availableSizes": [
                          "p",
                          "m",
                          "g",
                          "gg",
                          "xg"
                      ]
                  },
                  {
                      "name": "bojo",
                      "isUnique": false,
                      "sizeSetId": "610c5da4974ca338dc4b76ec",
                      "availableSizes": [
                          "38",
                          "40",
                          "42",
                          "44",
                          "46",
                          "48",
                          "50",
                          "52",
                          "54",
                          "56"
                      ]
                  },
                  {
                      "name": "alças",
                      "isUnique": false,
                      "sizeSetId": "610c5eed974ca338dc4b76f2",
                      "availableSizes": [
                          "7",
                          "10",
                          "13",
                          "18"
                      ]
                  }
              ],
              "images": [],
              "extraOptions": [
                  {
                      "name": "Bojo",
                      "options": [
                          "liso",
                          "bolha"
                      ]
                  }
              ]
          }
      ]
  }
  */

  // code
  if (product.code.trim().length < 4 || product.code.trim().length > 10)
    return false;
  if (!validateNameSlur(product.code)) return false;

  // name
  if (product.name.trim().length < 4 || product.name.trim().length > 15)
    return false;
  if (!validateNameSlur(product.name)) return false;

  // limitStock / stockNumber
  if (
    typeof product.limitStock !== 'boolean' &&
    typeof product.limitStock !== 'Boolean'
  )
    return false;
  if (
    product.limitStock &&
    product.stockNumber.toString().match(/[^0-9]/gi) != null
  )
    return false;
  if (product.limitStock && product.stockNumber < 1) return false;

  // price
  if (product.price.match(/[^0-9\.]/gi) != null || +product.price < 0)
    return false;

  // discountPercentage
  if (
    product.discountPercentage.match(/[^0-9\.]/gi) != null ||
    +product.discountPercentage < 0 ||
    +product.discountPercentage > 100
  )
    return false;

  // weight
  if (product.weight.match(/[^0-9\.]/gi) != null || +product.weight < 0)
    return false;

  // shortDescription
  if (
    product.shortDescription.trim().length < 5 ||
    product.shortDescription.trim().length > 40
  )
    return false;
  if (!validateNameSlur(product.shortDescription)) return false;

  // longDescription
  if (
    product.longDescription.trim().length < 50 ||
    product.longDescription.trim().length > 1000
  )
    return false;
  if (!validateNameSlur(product.longDescription)) return false;

  // categoryId
  if (product.categoryId.trim().length <= 0) return false;
  let category;
  try {
    category = await getCategoryById(product.categoryId);
    if (category == null || category == false) return false;
  } catch (err) {
    return false;
  }

  // sectionId
  if (product.sectionId.trim().length <= 0) return false;
  let section;
  try {
    section = await getSectionById(product.sectionId);
    if (section == null || section == false) return false;
  } catch (err) {
    return false;
  }

  // sets
  if (product.sets.length <= 0) return false;
  let isValid = true;
  for (const set of product.sets) {
    //colorId
    if (set.colorId.trim().length <= 0) {
      isValid = false;
      break;
    }
    let color;
    try {
      color = await getColorById(set.colorId);
      if (color == null || color == false) {
        isValid = false;
        break;
      }
    } catch (err) {
      isValid = false;
      break;
    }

    // sizeSets
    if (set.sizeSets.length > 0) {
      for (const sizeSet of set.sizeSets) {
        // name
        if (sizeSet.name.trim().length < 2 || sizeSet.name.trim().length > 15) {
          isValid = false;
          break;
        }
        if (!validateNameSlur(sizeSet.name)) {
          isValid = false;
          break;
        }

        // isUnique
        if (
          typeof sizeSet.isUnique !== 'boolean' &&
          typeof sizeSet.isUnique !== 'Boolean'
        ) {
          isValid = false;
          break;
        }

        // sizeSetId
        if (sizeSet.sizeSetId.trim().length <= 0) {
          isValid = false;
          break;
        }
        let sizeSetFromDb;
        try {
          sizeSetFromDb = await getSizeSetById(sizeSet.sizeSetId);
          if (sizeSetFromDb == null || sizeSetFromDb == false) {
            isValid = false;
            break;
          }
        } catch (err) {
          isValid = false;
          break;
        }

        // availableSizes
        if (sizeSet.availableSizes.length <= 0) {
          isValid = false;
          break;
        }
        for (const size of sizeSet.availableSizes) {
          if (sizeSetFromDb.sizes.findIndex((s) => s === size) < 0) {
            isValid = false;
            break;
          }
        }
        if (!isValid) return;
      }
    }

    // images
    // if (set.images.length <= 0) {
    //   isValid = false;
    //   break;
    // }

    // extraOptions
    if (set.extraOptions.length > 0) {
      for (const opt of set.extraOptions) {
        // name
        if (opt.name.trim().length < 2 || opt.name.trim().length > 15) {
          isValid = false;
          break;
        }
        if (!validateNameSlur(opt.name)) {
          isValid = false;
          break;
        }

        // options
        if (opt.options.length < 2) {
          isValid = false;
          break;
        }
        for (const op of opt.options) {
          if (op.trim().length < 2 || op.trim().length > 10) {
            isValid = false;
            break;
          }
          if (!validateNameSlur(op)) {
            isValid = false;
            break;
          }
        }
      }
    }

    if (!isValid) return;
  }

  return isValid;
};

export {
  validateNameSlur,
  validateIsEmail,
  validatePasswordSize,
  validateProduct,
};
