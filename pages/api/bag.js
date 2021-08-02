import { getProductImageThumb } from '../../data/products';

export default async function bag(req, res) {
  if (req.method === 'POST') {
    // Read from cookie
    const productsTumbs = await getProductImageThumb();
    res.status(200).json({ statusCode: '200', productsTumbs: productsTumbs });
  }
}
