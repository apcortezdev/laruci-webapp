import { getProductListing } from '../../../../data/products';

// /api/loja/products/[category]/[color]/[size]/[order]/[term]/[page]/[numperpage]
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('API\'d')
      console.log(req.query.slug)
      let list = [];
      list = await getProductListing(
        {
          category: req.query.slug[0],
          color: req.query.slug[1],
          size: req.query.slug[2],
          order: req.query.slug[3],
          term: req.query.slug[4],
        },
        req.query.slug[5],
        req.query.slug[6]
      );
      if (list.length > 0) {
        res.status(201).json({ statusCode: '200', data: list, lastPage: list.length < +req.query.slug[6]});
      } else {
        res.status(404).json({ statusCode: '404', data: list });
      }
    console.log(list);
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR LOADING: ' + err.message,
      });
    }
  }
}
