import { getProductListingByCategory } from '../../../../data/products';

// /api/admin/products/list/[categoryId]/[page]/[nuPerPage]
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const productList = await getProductListingByCategory(
        req.query.slug[1],
        req.query.slug[2],
        req.query.slug[3]
      );
      res.status(200).json({ statusCode: '200', productList: productList, lastPage: false });
    } catch (err) {
      console.log(err)
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING CATEGORY: ' + err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'NOT ALLOWED',
    });
  }
}
