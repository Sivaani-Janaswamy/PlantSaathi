const supabase = require('../config/supabaseClient');

async function authMiddleware(req, res, next) {
	const authHeader = req.headers['authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const token = authHeader.replace('Bearer ', '').trim();
	try {
		const { data, error } = await supabase.auth.getUser(token);
		if (error || !data || !data.user || !data.user.id) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		req.user = { id: data.user.id };
		next();
	} catch (err) {
		return res.status(401).json({ message: 'Unauthorized' });
	}
}

module.exports = authMiddleware;
