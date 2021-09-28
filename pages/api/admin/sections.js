import { getSession } from 'next-auth/client';
import { postSection, deleteSection, putSection } from '../../../data/sections';

export default async function handler(req, res) {
  const session = await getSession({ req: req });

  if (!session || session.user.name !== process.env.USERADM) {
    res.status(404).json({ message: 'Not Found.' });
    return;
  }

  if (req.method === 'POST') {
    try {
      const newSection = await postSection(req.body.text);
      res.status(201).json({ statusCode: '201', section: newSection });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR SAVING SECTION: ' + err.message,
      });
    }
  } else if (req.method === 'DELETE') {
    try {
      const deletedSection = await deleteSection(req.body.id);
      res.status(200).json({ statusCode: '200', section: deletedSection });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING SECTION: ' + err.message,
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedSection = await putSection(req.body.id, req.body.newText);
      res.status(200).json({ statusCode: '200', section: updatedSection });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING SECTION: ' + err.message,
      });
    }
  } else {
    res.status(405).json({
      statusCode: '405',
      message: 'Method Not Allowed',
    });
  }
}
