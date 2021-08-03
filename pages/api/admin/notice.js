import { postNotice } from '../../../data/notice';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let newNotice;
    console.log(req.body.notice)
    try {
      newNotice = postNotice(req.body.notice);
      res.status(201).json({ statusCode: '201', notice: newNotice });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ statusCode: '500', message: 'ERROR SAVING NOTICE' });
    }
  }
  if (req.method === 'PUT') {
    let newNotice;
    console.log(req.body.notice)
    try {
      newNotice = postNotice(req.body.notice);
      res.status(201).json({ statusCode: '201', notice: newNotice });
    } catch (err) {
      console.log(err);
      res
        .status(500)
        .json({ statusCode: '500', message: 'ERROR SAVING NOTICE' });
    }
  }
}
