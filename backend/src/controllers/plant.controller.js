exports.getRecommendations = async (req, res, next) => {
	try {
		if (!req.user || !req.user.id) {
			return res.status(401).json({ message: 'Unauthorized' });
		}
		const plants = await plantService.getRecommendations(req.user.id);
		res.status(200).json({ plants });
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
			return res.status(400).json({ message: 'Missing required query parameter: q' });
		}
		if (page < 1) page = 1;
		if (limit < 1) limit = 10;
		const { results, total } = await plantService.searchPlants(q, page, limit);
		res.json({
			data: results,
			pagination: {
				page,
				limit,
				total
			}
		});
	} catch (err) {
		next(err);
	}
};

exports.getPlantById = async (req, res, next) => {
	try {
		const { id } = req.params;
		if (!id || typeof id !== 'string' || id.trim() === '') {
			return res.status(400).json({ message: 'Invalid or missing id parameter' });
		}
		const plant = await plantService.getPlantById(id);
		if (!plant) {
			return res.status(404).json({ message: 'Plant not found' });
		}
		res.status(200).json(plant);
	} catch (err) {
		next(err);
	}
};

exports.identifyPlant = async (req, res, next) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: 'Image file is required' });
		}
		const plant = await plantService.identifyPlant(req.file);
		res.status(200).json(plant);
	} catch (err) {
		next(err);
	}
};
