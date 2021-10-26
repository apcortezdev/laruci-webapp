import {
  getProductByCode,
  postProduct,
  deleteProduct,
} from '../../../../data/access/products';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { validateProduct } from '../../../../validation/backValidation';
import { getSession } from 'next-auth/client';
import {
  getCategoryById,
  getSectionById,
} from '../../../../data/access/appInfo';

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

    try {
      const validatedProduct = await validateProduct(product);
      if (validatedProduct.status === 'error') {
        res.status(400).json({
          statusCode: '400',
          message: 'INVALID PRODUCT: ' + validatedProduct.errorMessage,
        });
        return;
      }
      const newProduct = await postProduct(validatedProduct.product);
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
        if (product)
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

export default async (req, res) => {
  // const session = await getSession({ req: req });

  // if (!session || session.user.name !== process.env.USERADM) {
  //   res.status(404).json({ message: 'Not Found.' });
  //   return;
  // }

  req.method === 'POST'
    ? post(req, res)
    : req.method === 'GET'
    ? get(req, res)
    : req.method === 'DELETE'
    ? del(req, res)
    : res.status(404).send('Not Found.');
};
