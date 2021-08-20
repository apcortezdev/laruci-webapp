import {
  postCategory,
  deleteCategory,
  putCategory,
} from '../../../data/categories';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newCategory = await postCategory(req.body.text);
      res.status(201).json({ statusCode: '201', category: newCategory });
    } catch (err) {
      if (err.message.startsWith('DUPLICATED')) {
        res.status(400).json({
          statusCode: '400',
          message: 'ERROR SAVING CATEGORY: CATEGORY ALREADY EXISTS',
        });
        return;
      }
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING CATEGORY: ' + err.message,
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deletedCategory = await deleteCategory(req.body.id);
      res.status(200).json({ statusCode: '200', category: deletedCategory });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING CATEGORY: ' + err.message,
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updatedCategory = await putCategory(req.body.id, req.body.newText);
      res.status(200).json({ statusCode: '200', category: updatedCategory });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING CATEGORY: ' + err.message,
      });
    }
  }
}
