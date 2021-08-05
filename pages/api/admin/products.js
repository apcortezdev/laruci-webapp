import { getProductImageThumb } from '../../data/products';

export default async function contactHandler(req, res) {
  if (req.method === 'GET') {
    const productsTumbs = await getProductImageThumb();
    res.status(200).json({ statusCode: '200', productsTumbs: productsTumbs });
  }
}
