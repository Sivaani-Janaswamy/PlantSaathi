// Contains business logic for AI assistant

const supabase = require('../config/supabaseClient');

const { logActivity } = require('../utils/activityLogger');

exports.askQuestion = async (question, userId = null) => {
	if (userId) logActivity(userId, 'ai_query', { query: question });
	// For tests: allow jest to mock this method
	if (process.env.NODE_ENV === 'test' && exports.__mockedAnswer) {
		return exports.__mockedAnswer;
	}

	// 1. Check ai_responses table for cached answer
	let cachedAnswer = null;
	try {
		const { data: cached, error: cacheError } = await supabase
			.from('ai_responses')
			.select('answer')
			.eq('question', question)
			.eq('user_id', userId)
			.maybeSingle();
		if (cacheError && cacheError.message !== 'No rows found') throw cacheError;
		if (cached && cached.answer) {
			return cached.answer;
		}
	} catch (err) {
		// Log but do not block on cache errors
	}

	// 2. Call external AI API only if not cached
	const apiKey = process.env.AI_API_KEY;
	if (!apiKey) {
		throw { status: 500, message: 'AI service failed: missing API key' };
	}
	const prompt = `You are a plant expert. Answer clearly and concisely: ${question}`;
	let answer;
	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: 'gpt-3.5-turbo',
				messages: [
					{ role: 'system', content: 'You are a plant expert.' },
					{ role: 'user', content: prompt }
				],
				max_tokens: 256,
				temperature: 0.7
			}),
			timeout: 10000
		});
		if (!response.ok) {
			throw new Error(`AI API error: ${response.status}`);
		}
		const data = await response.json();
		answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
		if (!answer) {
			throw new Error('AI API returned invalid response');
		}
		answer = answer.trim();
	} catch (err) {
		throw { status: 500, message: 'AI service failed' };
	}

	// 3. Store new answer in ai_responses
	try {
		await supabase
			.from('ai_responses')
			.insert([{ user_id: userId, question, answer }]);
	} catch (err) {
		// Log but do not block on cache insert errors
	}
	return answer;
};
