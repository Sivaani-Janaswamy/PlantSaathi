// Contains business logic for AI assistant

exports.askQuestion = async (question) => {
	// For tests: allow jest to mock this method
	if (process.env.NODE_ENV === 'test' && exports.__mockedAnswer) {
		return exports.__mockedAnswer;
	}

	const apiKey = process.env.AI_API_KEY;
	if (!apiKey) {
		throw { status: 500, message: 'AI service failed: missing API key' };
	}

	// Prompt engineering
	const prompt = `You are a plant expert. Answer clearly and concisely: ${question}`;

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
		const answer = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
		if (!answer) {
			throw new Error('AI API returned invalid response');
		}
		return answer.trim();
	} catch (err) {
		throw { status: 500, message: 'AI service failed' };
	}

	// TODO: Add rate limiting, caching, and better error reporting
};
