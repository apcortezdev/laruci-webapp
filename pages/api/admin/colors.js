import { postColors, deleteColors, putColors } from '../../../data/colors';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const newColor = await postColors(req.body.text, req.body.code);
      res.status(201).json({ statusCode: '201', color: newColor });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING COLOR: ' + err.message,
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const deletedColor = await deleteColors(req.body.id);
      res.status(200).json({ statusCode: '200', color: deletedColor });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING COLOR: ' + err.message,
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updatedColor = await putColors(req.body.id, req.body.newText, req.body.newCode);
      res.status(200).json({ statusCode: '200', color: updatedColor });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING COLOR: ' + err.message,
      });
    }
  }
}
