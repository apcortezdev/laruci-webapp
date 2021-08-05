import { postSizeSet, deleteSizeSet, putSizeSet } from '../../../data/sizeSets';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newSizeSet = await postSizeSet(req.body.name, req.body.sizes);
      res.status(201).json({ statusCode: '201', sizeSet: newSizeSet });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING SIZE SET: ' + err.message,
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deletedSizeSet = await deleteSizeSet(req.body.id);
      res.status(200).json({ statusCode: '200', sizeSet: deletedSizeSet });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING SIZE SET: ' + err.message,
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updatedSizeSet = await putSizeSet(req.body.id, req.body.name, req.body.sizes);
      res.status(200).json({ statusCode: '200', sizeSet: updatedSizeSet });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING SIZE SET: ' + err.message,
      });
    }
  }
}
