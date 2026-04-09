// Handles user favorites API requests
const favoriteService = require('../services/favorite.service');
exports.getFavorites = async (req, res, next) => {
	try {
		if (!req.user || !req.user.id) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const userId = req.user.id;
		const favorites = await favoriteService.getFavorites(userId);
		res.json({ favorites });
	} catch (err) {
		next(err);
	}
};

exports.addFavorite = async (req, res, next) => {
	try {
		if (!req.user || !req.user.id) {
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
