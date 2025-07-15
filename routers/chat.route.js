import express from 'express';
import { client } from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { name, email, info, conversation } = req.body;

  if (!name || !email || !info || !Array.isArray(conversation)) {
    return res.status(400).json({
      success: false,
      message: 'name, email, info and conversation are required',
    });
  }

  try {
    const result = await client.data
      .creator()
      .withClassName('Chat')
      .withProperties({
        name,
        email,
        info,
        conversation: JSON.stringify(conversation),
        createdAt: new Date().toISOString(),
      })
      .do();

    res.status(201).json({ success: true, id: result.id });
  } catch (err) {
    console.error('Error saving chat to Weaviate:', err.message);
    res.status(500).json({ success: false, message: 'Failed to save chat' });
  }
});

export default router;
