import { getProductListing } from '../../../../data/product';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const list = [];
      console.log(req.query);
      // const newBag = await postBag(req.body.bag);
      if (list.length > 0) {
        res.status(201).json({ statusCode: '200', list: list });
      } else {
        res.status(404).json({ statusCode: '404', list: list });
      }
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR LOADING: ' + err.message,
      });
    }
  }
}
