import { postProduct, deleteProduct, putProduct } from '../../../data/products';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newProduct = await postProduct(req.body.product);
      res.status(201).json({ statusCode: '201', Product: newProduct });
    } catch (err) {
      console.log(err);
      if (err.message === 'INVALID') {
        res.status(400).json({
          statusCode: '400',
          message: 'ERROR SAVING PRODUCT: PRODUCT HAS INVALID INFORMATION',
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

  if (req.method === 'PUT') {
    try {
      const updatedProduct = await putProduct(req.body.id, req.body.newText);
      res.status(200).json({ statusCode: '200', Product: updatedProduct });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING Product: ' + err.message,
      });
    }
  }
}
