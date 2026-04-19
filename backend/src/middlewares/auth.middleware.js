const supabase = require('../config/supabaseClient');

async function authMiddleware(req, res, next) {
	const authHeader = req.headers['authorization'];
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ 
			success: false, 
			message: 'Missing or invalid authorization header' 
		});
	}
	
	const token = authHeader.replace('Bearer ', '').trim();
	
	// Validate token format (basic check for JWT structure)
	if (!token || token.split('.').length !== 3) {
		return res.status(401).json({ 
			success: false, 
			message: 'Invalid token format' 
		});
	}
	
	try {
		const { data, error } = await supabase.auth.getUser(token);
		
		// Handle specific Supabase errors
		if (error) {
			console.error('Supabase auth error:', error.message);
			if (error.message.includes('Invalid JWT')) {
				return res.status(401).json({ 
					success: false, 
					message: 'Invalid or expired token' 
				});
			}
			return res.status(401).json({ 
				success: false, 
				message: 'Authentication failed' 
			});
		}
		
		if (!data || !data.user || !data.user.id) {
			return res.status(401).json({ 
				success: false, 
				message: 'User not found or invalid session' 
			});
		}
		
		// Attach user info to request
		req.user = { 
			id: data.user.id,
			email: data.user.email,
			aud: data.user.aud
		};
		
		next();
	} catch (err) {
		console.error('Auth middleware error:', err);
		return res.status(401).json({ 
			success: false, 
			message: 'Authentication service error' 
		});
	}
}

module.exports = authMiddleware;
