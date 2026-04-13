const supabase = require('../config/supabaseClient');

async function authMiddleware(req, res, next) {
	console.log('[AUTH] Authorization header:', req.headers['authorization']);
	console.log('[AUTH] User before attach:', req.user);
	const authHeader = req.headers['authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		console.log('[AUTH] Unauthorized request');
		return res.status(401).json({ message: 'Unauthorized' });
	}
	const token = authHeader.replace('Bearer ', '').trim();
	try {
		const { data, error } = await supabase.auth.getUser(token);
		if (error || !data || !data.user || !data.user.id) {
			console.log('[AUTH] Unauthorized request');
			return res.status(401).json({ message: 'Unauthorized' });
		}
		req.user = { id: data.user.id };
		console.log('[AUTH] User after attach:', req.user);
		next();
	} catch (err) {
		console.log('[AUTH] Unauthorized request');
		return res.status(401).json({ message: 'Unauthorized' });
	}
}

module.exports = authMiddleware;
