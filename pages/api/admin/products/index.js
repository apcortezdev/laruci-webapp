import {
  getProductByCode,
  postProduct,
  deleteProduct,
} from '../../../../data/products';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { validateProduct } from '../../../../utils/validation';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

const saveFile = async (prodId, file) => {
  const dir = path.join(process.cwd(), 'public', 'images', 'products', prodId);
  if (!fs.existsSync(dir)) {
    // creates dir if not existent
    fs.mkdirSync(dir, { recursive: true });
  }

  const data = fs.readFileSync(file.file.path);
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'images', 'products', prodId, file.name),
    data
  );
  // await fs.unlinkSync(file.path);
  return;
};

const prepareProduct = (product) => {
  let newProduct = {
    code: product.code.trim(),
    name: product.name.trim(),
    limitStock: product.limitStock,
    stockNumber: product.stockNumber,
    categoryId: product.categoryId,
    sectionId: product.sectionId,
    price:
      typeof product.price === 'number'
        ? product.price
        : product.price.trim().length > 0
        ? product.price.trim()
        : '0',
    discountPercentage:
      typeof product.discountPercentage === 'number'
        ? product.discountPercentage
        : product.discountPercentage.trim().length > 0
        ? product.discountPercentage.trim()
        : '0',
    weight:
      typeof product.weight === 'number'
        ? product.weight
        : product.weight.trim().length > 0
        ? product.weight.trim()
        : '0',
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

const post = async (req, res) => {
  const form = new formidable.IncomingForm({
    multiples: true,
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR PARSING: ' + err,
      });
      return;
    }

    const product = await JSON.parse(fields.product);

    const preparedProduct = prepareProduct(product);
    let validatedProduct;
    
    try {
      validatedProduct = await validateProduct(preparedProduct);
      if (typeof validatedProduct === 'string') {
        res.status(400).json({
          statusCode: '400',
          message: 'INVALID PRODUCT: ' + validatedProduct,
        });
        return;
      }
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'INVALID PRODUCT: ' + err,
      });
      return;
    }

    try {
      const newProduct = await postProduct(validatedProduct);
      try {
        // changes from obj to array
        let fileList = [];
        for (const key in files) {
          if (Object.hasOwnProperty.call(files, key)) {
            fileList.push({ name: key, file: files[key] });
          }
        }
        for (const file of fileList) {
          await saveFile(newProduct._id.toString(), file);
        }
        res.status(201).json({ statusCode: '201', product: newProduct });
      } catch (err) {
        await deleteProduct(newProduct._id);
        res.status(500).json({
          statusCode: '500',
          message: 'ERROR SAVING IMAGES: ' + err.message,
        });
      }
    } catch (err) {
      if (err.message === 'DUPLICATED CODE')
        res.status(400).json({
          statusCode: '500',
          message: 'ERROR SAVING PRODUCT: ' + err.message,
        });
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING PRODUCT: ' + err.message,
      });
    }
  });
};

// api/admin/products?code=
const get = async (req, res) => {
  const code = req.query.code || '';

  try {
    if (typeof code !== 'undefined' || code.length < 0 || !code) {
      try {
        const product = await getProductByCode(code);
        if (product.length > 0)
          res.status(200).json({ statusCode: '200', product: product });
        else res.status(404).json({ statusCode: '404', message: 'NOT FOUND' });
      } catch (err) {
        res.status(400).json({
          statusCode: '400',
          message: 'NOTHING FOUND',
        });
      }
    } else {
      res.status(400).json({
        statusCode: '400',
        message: 'ERROR SEEKING PRODUCT: NO CODE',
      });
    }
  } catch (err) {
    res.status(500).json({
      statusCode: '500',
      message: 'INTERNAL ERROR: ' + err,
    });
  }
};

const del = async (req, res) => {
  const form = new formidable.IncomingForm({
    multiples: true,
    keepExtensions: true,
  });
  form.parse(req, async (err, fields) => {
    if (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR PARSING: ' + err,
      });
      return;
    }

    const id = fields.id;
    const auth = fields.auth;

    if (typeof auth === 'undefined' || auth.length < 0 || !auth) {
      res.status(401).json({
        statusCode: '401',
        message: 'UNAUTHORIZED',
      });
      return;
    }

    if (typeof id === 'undefined' || id.length < 0 || !id) {
      res.status(400).json({
        statusCode: '400',
        message: 'ERROR SEEKING PRODUCT: NO CODE',
      });
      return;
    }

    try {
      // const deletedProduct = await deleteProduct(id);
      const dir = path.join(process.cwd(), 'public', 'images', 'products', id);
      if (fs.existsSync(dir)) {
        // deletes dir if exists
        fs.rmdir(dir, { recursive: true }, (err) => {
          if (err) {
            res.status(500).json({
              statusCode: '500',
              message: 'ERROR DELETING IMAGES: ' + err.message,
            });
            return;
          }
          res.status(200).json({ statusCode: '200', Product: deletedProduct });
        });
      }
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING PRODUCT: ' + err.message,
      });
    }
  });
};

export default (req, res) => {
  req.method === 'POST'
    ? post(req, res)
    : req.method === 'GET'
    ? get(req, res)
    : req.method === 'DELETE'
    ? del(req, res)
    : res.status(404).send('');
};
