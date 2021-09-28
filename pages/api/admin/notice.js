import { getSession } from 'next-auth/client';
import { postNotice } from '../../../data/notice';

export default async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session || session.user.name !== process.env.USERADM) {
    res.status(404).json({ message: 'Not Found.' });
    return;
  }

  if (req.method === 'POST') {
    let newNotice;
    try {
      newNotice = postNotice(req.body.notice);
      res.status(201).json({ statusCode: '201', notice: newNotice });
    } catch (err) {
      res
        .status(500)
        .json({ statusCode: '500', message: 'ERROR SAVING NOTICE' });
    }
  } else if (req.method === 'PUT') {
    let newNotice;
    try {
      newNotice = postNotice(req.body.notice);
      res.status(201).json({ statusCode: '201', notice: newNotice });
    } catch (err) {
      res
        .status(500)
        .json({ statusCode: '500', message: 'ERROR SAVING NOTICE' });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
