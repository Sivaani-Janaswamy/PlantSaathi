// Middleware for authenticating and authorizing users
const supabase = require('../config/supabaseClient');

async function authMiddleware(req, res, next) {
	const authHeader = req.headers['authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Missing or invalid Authorization header' });
	}
	const token = authHeader.replace('Bearer ', '');
	// Supabase JWT verification
	const { data, error } = await supabase.auth.getUser(token);
	if (error || !data || !data.user) {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
	req.user = data.user;
	next();
}

module.exports = authMiddleware;
