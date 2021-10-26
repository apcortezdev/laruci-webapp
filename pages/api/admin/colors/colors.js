import { getSession } from 'next-auth/client';
import { postColor, deleteColor, putColor } from '../../../../data/access/colors';

export default async function handler(req, res) {
  // const session = await getSession({ req: req });

  // if (!session || session.user.name !== process.env.USERADM) {
  //   res.status(404).json({ message: 'Not Found.' });
  //   return;
  // }

  if (req.method === 'POST') {
    try {
      const newColor = await postColor(req.body.name, req.body.code);
      res.status(201).json({ statusCode: '201', color: newColor });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING COLOR: ' + err.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedColor = await deleteColor(req.body.id);
      res.status(200).json({ statusCode: '200', color: deletedColor });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING COLOR: ' + err.message,
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedColor = await putColor(
        req.body.id,
        req.body.name,
        req.body.code
      );
      res.status(200).json({ statusCode: '200', color: updatedColor });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING COLOR: ' + err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
