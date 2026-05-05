import { supabase } from '../config/database.js';
import { generatePlantAdvice } from '../integrations/anthropic.js';
import { AppError } from '../middleware/errorHandler.js';

export const chat = async (req, res, next) => {
  try {
    const { message, plantId } = req.body;
    const userId = req.user?.id;

    if (!message || message.trim().length === 0) {
      throw new AppError('Message cannot be empty', 400);
    }

    // Save user message
    if (userId) {
      await supabase.from('chat_messages').insert({
        user_id: userId,
        plant_id: plantId || null,
        role: 'user',
        content: message
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Get AI response
    const stream = await generatePlantAdvice(message);

    let fullResponse = '';

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        const text = chunk.delta.text;
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    // Save assistant message
    if (userId) {
      const tokensUsed = Math.ceil(fullResponse.length / 4);
      await supabase.from('chat_messages').insert({
        user_id: userId,
        plant_id: plantId || null,
        role: 'assistant',
        content: fullResponse,
        tokens_used: tokensUsed
      });
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    next(error);
  }
};
