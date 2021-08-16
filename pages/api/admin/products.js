import {
  getProductByCode,
  postProduct,
  deleteProduct,
  putProduct,
} from '../../../data/products';

export default async function handler(req, res) {

  if (req.method === 'POST') {
    try {
      // const newProduct = await postProduct(req.body.product);
      console.log(req.body.product);
      // res.status(201).json({ statusCode: '201', product: newProduct });
      res.status(201).json({ statusCode: '201' });
    } catch (err) {
      if (err.message.startsWith('INVALID')) {
        res.status(400).json({
          statusCode: '400',
          message: 'ERROR SAVING PRODUCT: ' + err.message,
        });
      } else {
        res.status(500).json({
          statusCode: '500',
          message: 'ERROR SAVING PRODUCT: ' + err.message,
        });
      }
    }
  }

  /// api/admin/products?code=
  if (req.method === 'GET') {
    const code = req.query.code;

    if (typeof code !== 'undefined') {
      try {
        const product = await getProductByCode(code);
        if (product.length > 0)
          res.status(200).json({ statusCode: '200', product: product });
        else 
          res.status(404).json({ statusCode: '404', message: 'NOT FOUND', });
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
  }

  if (req.method === 'PUT') {
    try {
      const newProduct = await putProduct(req.body.id, req.body.product);
      res.status(201).json({ statusCode: '201', product: newProduct });
    } catch (err) {
      if (err.message.startsWith('INVALID')) {
        res.status(400).json({
          statusCode: '400',
          message: 'ERROR SAVING PRODUCT: ' + err.message,
        });
      } else {
        res.status(500).json({
          statusCode: '500',
          message: 'ERROR SAVING PRODUCT: ' + err.message,
        });
      }
    }
  }




  if (req.method === 'DELETE') {
    try {
      const deletedProduct = await deleteProduct(req.body.id);
      res.status(200).json({ statusCode: '200', Product: deletedProduct });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING Product: ' + err.message,
      });
    }
  }


}
