import { postSection, deleteSection, putSection } from '../../../data/sections';

export default async function handler(req, res) {
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
  }

  if (req.method === 'DELETE') {
    try {
      const deletedSection = await deleteSection(req.body.id);
      res.status(200).json({ statusCode: '200', section: deletedSection });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR DELETING SECTION: ' + err.message,
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updatedSection = await putSection(req.body.id, req.body.newText);
      res.status(200).json({ statusCode: '200', section: updatedSection });
    } catch (err) {
      res.status(500).json({
        statusCode: '500',
        message: 'ERROR UPDATING SECTION: ' + err.message,
      });
    }
  }
}
