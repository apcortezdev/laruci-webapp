import { getSession } from 'next-auth/client';
import { getBagItems, postBag } from '../../../data/access/bag';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const bagId = req.query.id;
      const session = await getSession({ req: req });
      const items = await getBagItems(bagId, session?.user.email);

      res.status(200).json({ statusCode: '200', items: items });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR: ' + err.message,
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const bag = req.body;
      if (!bag.items?.length) {
        res.status(400).json({ statusCode: '400', message: 'EMPTY LIST' });
      }

      const session = await getSession({ req: req });
      const postedBag = await postBag(bag, session?.user.email);

      res.status(201).json({ statusCode: '201', bag: postedBag });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR: ' + err.message,
      });
    }
  }

  if (req.method === 'DELETE') {
    // try {
    //   const deletedCategory = await deleteCategory(req.body.id);
    //   res.status(200).json({ statusCode: '200', category: deletedCategory });
    // } catch (err) {
    //   res.status(500).json({
    //     statusCode: '500',
    //     message: 'ERROR DELETING CATEGORY: ' + err.message,
    //   });
    // }
  }
}
