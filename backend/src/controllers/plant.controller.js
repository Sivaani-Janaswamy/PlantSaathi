exports.getRecommendations = async (req, res, next) => {
	try {
		   if (!req.user || !req.user.id) {
			   return res.status(401).json({ success: false, message: 'Unauthorized' });
		   }
		   const plants = await plantService.getRecommendations(req.user.id);
		   res.status(200).json({ success: true, data: plants });
	} catch (err) {
		next(err);
	}
};
// Handles plant-related API requests (search, details, identify)
const plantService = require('../services/plant.service');

exports.searchPlants = async (req, res, next) => {
	try {
		const q = req.query.q;
		let page = parseInt(req.query.page, 10) || 1;
		let limit = parseInt(req.query.limit, 10) || 10;
		   if (typeof q !== 'string' || q.trim() === '') {
			   return res.status(400).json({ success: false, message: 'Missing required query parameter: q' });
		   }
		if (page < 1) page = 1;
		if (limit < 1) limit = 10;
		const { results, total } = await plantService.searchPlants(q, page, limit);
		   return res.status(200).json({
			   success: true,
			   data: {
				   plants: results,
				   pagination: {
					   page,
					   limit,
					   total
				   }
			   }
		   });
	} catch (err) {
		return res.status(500).json({ success: false, message: 'Internal server error' });
	}
};

exports.getPlantById = async (req, res, next) => {
	try {
		const { id } = req.params;
		   if (!id || typeof id !== 'string' || id.trim() === '') {
			   return res.status(400).json({ success: false, message: 'Invalid or missing id parameter' });
		   }
		   const plant = await plantService.getPlantById(id);
		   if (!plant) {
			   return res.status(404).json({ success: false, message: 'Plant not found' });
		   }
		   return res.status(200).json({ success: true, data: plant });
	   } catch (err) {
		   return res.status(500).json({ success: false, message: 'Internal server error' });
	   }
};

exports.identifyPlant = async (req, res, next) => {
	try {
		   if (!req.file) {
			   return res.status(400).json({ success: false, message: 'Image file is required' });
		   }
		try {
			const plant = await plantService.identifyPlant(req.file);
			   return res.status(200).json({ success: true, data: plant });
		   } catch (err) {
			   return res.status(200).json({ success: false, message: err && err.message ? err.message : 'Identification failed' });
		   }
	} catch (err) {
		return res.status(200).json({ success: false, message: 'Identification failed' });
	}
};
