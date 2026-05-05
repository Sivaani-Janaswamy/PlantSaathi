import Anthropic from '@anthropic-ai/sdk';
import { AppError } from '../middleware/errorHandler.js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

export const generatePlantAdvice = async (message, plantContext = null) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new AppError('AI service not configured', 503);
  }

  const systemPrompt = `You are PlantSaathi, a helpful plant care assistant.
Provide friendly, accurate advice about plant identification, care, and troubleshooting.
Keep responses concise (under 300 words) and conversational.
${plantContext ? `Context: The user is asking about ${plantContext.common_name} (${plantContext.scientific_name})` : ''}`;

  try {
    const stream = await client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }]
    });

    return stream;
  } catch (error) {
    throw new AppError(`AI service error: ${error.message}`, 503);
  }
};
