import { postBag, addOrRemoveFromBag } from '../../../data/bag';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newBag = await postBag(req.body.bag);
      res.status(201).json({ statusCode: '201', bag: newBag });
    } catch (err) {
      if (err.message.startsWith('DUPLICATED')) {
        res.status(400).json({
          statusCode: '400',
          message: 'BAG ALREADY EXISTS. PLEASE DELETE FIRST',
        });
        return;
      }
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING BAG: ' + err.message,
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

  if (req.method === 'PUT') {
    try {
      const bag = await addOrRemoveFromBag(req.body.id, req.body.item);
      res.status(200).json({ statusCode: '200', bag: bag });
    } catch (err) {
      if (err.message.startsWith('ERN005: NOT FOUND')) {
        res.status(404).json({
          statusCode: '404',
          message: 'BAG OR ITEM NOT FOUND',
        });
        return;
      }
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING BAG: ' + err.message,
      });
    }
  }
}
