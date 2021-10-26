const states = [
  'ac',
  'al',
  'ap',
  'am',
  'ba',
  'ce',
  'df',
  'es',
  'go',
  'ma',
  'mt',
  'ms',
  'mg',
  'pa',
  'pb',
  'pr',
  'pe',
  'pi',
  'rj',
  'rn',
  'rs',
  'ro',
  'rr',
  'sc',
  'sp',
  'se',
  'to',
];

const validateEmail = (email) => {
  if (!email) return false;
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePasswordLength = (pass) => {
  if (!pass) return false;
  if (pass.toString().length < 6 || pass.toString().length > 24) {
    return false;
  }
  return true;
};

const validatePasswordStrength = (pass) => {
  if (!pass) return false;
  if (!/[^a-z]/gi.test(pass)) return false;
  if (!/[^0-9]/gi.test(pass)) return false;

  return true;
};

const validateCPF = (cpf) => {
  if (!cpf) return false;
  const regex = /^(?:(\d)\1{10})$|(\D)|^(\d{12,})$|^(\d{0,10})$/g;
  if (cpf.length !== 11) return false;
  if (/[^0-9]/g.test(cpf)) return false;
  if (cpf.match(regex)) return false;
  let sum = 0,
    rest = 0;

  for (let i = 1; i <= 9; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++)
    sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if (rest == 10 || rest == 11) rest = 0;
  if (rest != parseInt(cpf.substring(10, 11))) return false;

  return true;
};

const validateCNPJ = (cnpj) => {
  if (!cnpj) return false;

  cnpj = cnpj.replace(/[^\d]+/g, '');
  if (cnpj == '') return false;
  if (cnpj.length != 14) return false;

  // Elimina CNPJs invalidos conhecidos
  if (
    cnpj == '00000000000000' ||
    cnpj == '11111111111111' ||
    cnpj == '22222222222222' ||
    cnpj == '33333333333333' ||
    cnpj == '44444444444444' ||
    cnpj == '55555555555555' ||
    cnpj == '66666666666666' ||
    cnpj == '77777777777777' ||
    cnpj == '88888888888888' ||
    cnpj == '99999999999999'
  )
    return false;

  // Valida DVs
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  let digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;

  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
};

const validateIsValidName = (name) => {
  if (!name) return false;
  return !/[^a-záâãéíóôõúü\s]/gi.test(name);
};

const validatePhone = (phone) => {
  if (!phone) return false;
  if (phone.length !== 10 && phone.length !== 11) return false;
  if (/[a-z]/gi.test(phone)) return false;
  return true;
};

const validateState = (state) => {
  if (!state) return false;
  if (states.indexOf(state.toLowerCase()) >= 0) return true;
  return false;
};

const validateIsFullName = (name) => {
  if (name.split(' ').length <= 1) {
    return false;
  }
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

const removeAccents = (text) => {
  text = text.toLowerCase();
  text = text.replace(/á/, 'a');
  text = text.replace(/à/, 'a');
  text = text.replace(/â/, 'a');
  text = text.replace(/ã/, 'a');
  text = text.replace(/ä/, 'a');
  text = text.replace(/é/, 'e');
  text = text.replace(/è/, 'e');
  text = text.replace(/ê/, 'e');
  text = text.replace(/ë/, 'e');
  text = text.replace(/í/, 'i');
  text = text.replace(/ì/, 'i');
  text = text.replace(/î/, 'i');
  text = text.replace(/ï/, 'i');
  text = text.replace(/ó/, 'o');
  text = text.replace(/ò/, 'o');
  text = text.replace(/ô/, 'o');
  text = text.replace(/õ/, 'o');
  text = text.replace(/ö/, 'o');
  text = text.replace(/ú/, 'u');
  text = text.replace(/ù/, 'u');
  text = text.replace(/û/, 'u');
  text = text.replace(/ü/, 'u');
  text = text.replace(/ç/, 'c');
  text = text.replace(' ', '_');
  return text;
} 

export {
  validateEmail,
  validatePasswordLength,
  validatePasswordStrength,
  validateCPF,
  validateCNPJ,
  validateIsValidName,
  validatePhone,
  validateState,
  validateIsFullName,
  validateProduct,
  removeAccents
};
