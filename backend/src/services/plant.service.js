// Contains business logic for plant features
const supabase = require('../config/supabaseClient');

exports.searchPlants = async (q) => {
	const query = supabase
		.from('plants')
		.select('*')
		.ilike('common_name', `%${q}%`);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	return data;
};

exports.getPlantById = async (id) => {
	const { data, error } = await supabase
		.from('plants')
		.select('*')
		.eq('id', id)
		.single();
	if (error && error.code !== 'PGRST116') { // PGRST116: No rows found
		throw new Error(error.message);
	}
	return data || null;
};


const axios = require('axios');
const FormData = require('form-data');

exports.identifyPlant = async (image) => {
	// For tests: allow jest to mock this method
	if (process.env.NODE_ENV === 'test' && exports.__mockedPlant) {
		return exports.__mockedPlant;
	}

	if (!image || !image.buffer) {
		const err = new Error('Image file is required');
		err.status = 400;
		throw err;
	}

	const apiKey = process.env.PLANT_API_KEY;
	if (!apiKey) {
		const err = new Error('Plant API key missing');
		err.status = 500;
		throw err;
	}

	// Prepare multipart/form-data for PlantNet API
	const form = new FormData();
	form.append('images', image.buffer, image.originalname || 'plant.jpg');

	let apiResponse;
	try {
		const response = await axios.post(
			`https://my-api.plantnet.org/v2/identify/all?api-key=${apiKey}`,
			form,
			{ headers: form.getHeaders(), timeout: 15000 }
		);
		apiResponse = response.data;
	} catch (err) {
		const error = new Error('Plant identification service failed');
		error.status = 500;
		throw error;
	}

	// Parse response (PlantNet format)
	const best = apiResponse && apiResponse.results && apiResponse.results[0];
	if (!best || !best.species || !best.species.scientificNameWithoutAuthor) {
		const error = new Error('Could not identify plant');
		error.status = 400;
		throw error;
	}
	const scientific_name = best.species.scientificNameWithoutAuthor;
	const common_name = (best.species.commonNames && best.species.commonNames[0]) || scientific_name;
	const image_url = (best.images && best.images[0] && best.images[0].url.o) || null;

	// Check if plant already exists in DB (by scientific_name)
	const { data: existing, error: findError } = await supabase
		.from('plants')
		.select('*')
		.eq('scientific_name', scientific_name)
		.single();
	if (findError && findError.code !== 'PGRST116') throw new Error(findError.message);
	if (existing) return existing;

	// Insert new plant if not found
	const insertPayload = {
		common_name,
		scientific_name,
		image_url
	};
	const { data: created, error: insertError } = await supabase
		.from('plants')
		.insert([insertPayload])
		.select()
		.single();
	if (insertError) throw new Error(insertError.message);
	return created;
};
