import { postCategories, deleteCategories, putCategories } from '../../../data/categories';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newCategory = await postCategories(req.body.text);
      res.status(201).json({ statusCode: '201', category: newCategory });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING CATEGORY: ' + err.message,
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deletedCategory = deleteCategories(req.body.id);
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
      const updatedCategory = putCategories(req.body.id, req.body.newText);
      res.status(200).json({ statusCode: '200', category: updatedCategory });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING CATEGORY: ' + err.message,
      });
    }
  }
}
