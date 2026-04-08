// Handles plant-related API requests (search, details, identify)
const plantService = require('../services/plant.service');

exports.searchPlants = async (req, res, next) => {
	try {
		const q = req.query.q;
		if (typeof q !== 'string' || q.trim() === '') {
			return res.status(400).json({ message: 'Missing required query parameter: q' });
		}
		const plants = await plantService.searchPlants(q);
		res.json({ plants });
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

exports.identifyPlant = (req, res) => {
	res.json({ message: 'identifyPlant not implemented' });
};
