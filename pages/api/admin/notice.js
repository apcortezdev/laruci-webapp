import { postNotice } from '../../../data/notice';

export default async function handler(req, res) {
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
  }
  if (req.method === 'PUT') {
    let newNotice;
    try {
      newNotice = postNotice(req.body.notice);
      res.status(201).json({ statusCode: '201', notice: newNotice });
    } catch (err) {
      res
        .status(500)
        .json({ statusCode: '500', message: 'ERROR SAVING NOTICE' });
    }
  }
}
