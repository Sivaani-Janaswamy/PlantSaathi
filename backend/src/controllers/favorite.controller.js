// Handles user favorites API requests
const favoriteService = require('../services/favorite.service');
exports.getFavorites = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const userId = req.user.id;
		let page = parseInt(req.query.page, 10) || 1;
		let limit = parseInt(req.query.limit, 10) || 10;
		if (page < 1) page = 1;
		if (limit < 1) limit = 10;
		const { results } = await favoriteService.getFavorites(userId, page, limit);
		// Treat null as []
		res.status(200).json({ favorites: Array.isArray(results) ? results : [] });
	} catch (err) {
		next(err);
	}
};

exports.addFavorite = async (req, res, next) => {
	try {
		if (!req.user) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const userId = req.user.id;
		const { type, plant_id, text } = req.body;
		if (type !== 'plant' && type !== 'ai') {
			return res.status(400).json({ message: 'Invalid type. Must be "plant" or "ai".' });
		}
		if (type === 'plant' && !plant_id) {
			return res.status(400).json({ message: 'plant_id is required for type "plant".' });
		}
		if (type === 'ai' && (!text || typeof text !== 'string' || text.trim() === '')) {
			return res.status(400).json({ message: 'text is required for type "ai".' });
		}
		const data = { type, plant_id: plant_id || null, text: text || null };
		const favorite = await favoriteService.createFavorite(data, userId);
		res.status(201).json(favorite);
	} catch (err) {
		next(err);
	}
};
