import { getFullContactInfo } from '../../data/contact';

export default function contactHandler(req, res) {
  if (req.method === 'POST') {
    const contact = getFullContactInfo();
    res.status(200).json({ statusCode: '200', contact: contact });
  }
  res.status(201).json({ statusCode: '201', message: 'success' });
}
