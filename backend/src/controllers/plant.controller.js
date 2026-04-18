// Handles plant-related API requests (search, details, identify)
const plantService = require('../services/plant.service');
const { sendSuccess, sendError } = require('../utils/apiResponse');

exports.searchPlants = async (req, res, next) => {
	try {
		const q = req.query.q;
		let page = parseInt(req.query.page, 10) || 1;
		let limit = parseInt(req.query.limit, 10) || 10;
		   if (typeof q !== 'string' || q.trim() === '') {
			   return sendError(res, 400, 'Missing required query parameter: q');
		   }
		if (page < 1) page = 1;
		if (limit < 1) limit = 10;
		const { results, total } = await plantService.searchPlants(q, page, limit);
		   return sendSuccess(res, 200, {
			   plants: results,
			   pagination: {
				   page,
				   limit,
				   total
			   }
		   });
	} catch (err) {
		return sendError(res, 500, 'Internal server error');
	}
};

exports.getPlantById = async (req, res, next) => {
	try {
		const { id } = req.params;
		   if (!id || typeof id !== 'string' || id.trim() === '') {
			   return sendError(res, 400, 'Invalid or missing id parameter');
		   }
		   const plant = await plantService.getPlantById(id);
		   if (!plant) {
			   return sendError(res, 404, 'Plant not found');
		   }
		   return sendSuccess(res, 200, plant);
	   } catch (err) {
		   return sendError(res, 500, 'Internal server error');
	   }
};

exports.identifyPlant = async (req, res, next) => {
	try {
		   if (!req.file) {
			   return sendError(res, 400, 'Image file is required');
		   }
		const plant = await plantService.identifyPlant(req.file);
		return sendSuccess(res, 200, plant);
	} catch (err) {
		return sendError(res, err && err.status ? err.status : 500, err && err.message ? err.message : 'Identification failed');
	}
};
