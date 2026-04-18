// Handles user favorites API requests
const favoriteService = require('../services/favorite.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');
exports.getFavorites = async (req, res, next) => {
	try {
		   if (!req.user) {
			   return sendError(res, 401, 'Unauthorized');
		   }
		const userId = req.user.id;
		let page = parseInt(req.query.page, 10) || 1;
		let limit = parseInt(req.query.limit, 10) || 10;
		if (page < 1) page = 1;
		if (limit < 1) limit = 10;
		let results = [];
		try {
			const { results: favs } = await favoriteService.getFavorites(userId, page, limit);
			results = Array.isArray(favs) ? favs : [];
		} catch (err) {
			// If Supabase error, treat as empty array
			results = [];
		}
		return sendSuccess(res, 200, results);
	   } catch (err) {
		   return sendError(res, 500, 'Internal server error');
	   }
};

exports.addFavorite = async (req, res, next) => {
	try {
		   if (!req.user) {
			   return sendError(res, 401, 'Unauthorized');
		   }
		const userId = req.user.id;
		const { type, plant_id, text } = req.body;
		   if (type !== 'plant' && type !== 'ai') {
			   return sendError(res, 400, 'Invalid type. Must be "plant" or "ai".');
		   }
		   if (type === 'plant' && !plant_id) {
			   return sendError(res, 400, 'plant_id is required for type "plant".');
		   }
		   if (type === 'ai' && (!text || typeof text !== 'string' || text.trim() === '')) {
			   return sendError(res, 400, 'text is required for type "ai".');
		   }
		const data = { type, plant_id: plant_id || null, text: text || null };
		const favorite = await favoriteService.createFavorite(data, userId);
		return sendSuccess(res, 201, favorite);
	   } catch (err) {
		   return sendError(res, 500, 'Internal server error');
	   }
};

exports.deleteFavorite = async (req, res, next) => {
	try {
		   if (!req.user) {
			   return sendError(res, 401, 'Unauthorized');
		   }
		const userId = req.user.id;
		const { id } = req.params;
		if (!id) {
			return sendError(res, 400, 'Favorite id is required.');
		}
		const removed = await favoriteService.deleteFavorite(id, userId);
		if (!removed) {
			return sendError(res, 404, 'Favorite not found.');
		}
		return sendSuccess(res, 200, removed);
	   } catch (err) {
		   return sendError(res, 500, 'Internal server error');
	   }
};
