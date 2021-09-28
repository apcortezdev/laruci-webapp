import { getSession } from 'next-auth/client';
import { postSizeSet, deleteSizeSet, putSizeSet } from '../../../data/sizeSets';

export default async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session || session.user.name !== process.env.USERADM) {
    res.status(404).json({ message: 'Not Found.' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const newSizeSet = await postSizeSet(req.body.name, req.body.sizes);
      res.status(201).json({ statusCode: '201', sizeSet: newSizeSet });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING SIZE SET: ' + err.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedSizeSet = await deleteSizeSet(req.body.id);
      res.status(200).json({ statusCode: '200', sizeSet: deletedSizeSet });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING SIZE SET: ' + err.message,
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedSizeSet = await putSizeSet(
        req.body.id,
        req.body.name,
        req.body.sizes
      );
      res.status(200).json({ statusCode: '200', sizeSet: updatedSizeSet });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING SIZE SET: ' + err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
