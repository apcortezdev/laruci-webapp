import {
  postCategory,
  deleteCategory,
  putCategory,
} from '../../../data/categories';
import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session || session.user.name !== process.env.USERADM) {
    res.status(404).json({ message: 'Not Found.' });
    return;
  }

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
  } else if (req.method === 'DELETE') {
    try {
      const deletedCategory = await deleteCategory(req.body.id);
      res.status(200).json({ statusCode: '200', category: deletedCategory });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING CATEGORY: ' + err.message,
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedCategory = await putCategory(req.body.id, req.body.newText);
      res.status(200).json({ statusCode: '200', category: updatedCategory });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING CATEGORY: ' + err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
