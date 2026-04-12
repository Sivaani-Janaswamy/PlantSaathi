exports.getRecommendations = async (userId) => {
	// 1. Get user's recent activity
	let activity = [];
	try {
		const { data, error } = await supabase
			.from('user_activity')
			.select('activity_type, query, reference_id')
			.eq('user_id', userId)
			.order('created_at', { ascending: false })
			.limit(20);
		if (!error && data) activity = data;
	} catch {}

	// 2. Extract searched terms and viewed plants
	const searchTerms = activity.filter(a => a.activity_type === 'search' && a.query).map(a => a.query);
	const viewedPlantIds = activity.filter(a => a.activity_type === 'plant_view' && a.reference_id).map(a => a.reference_id);

	// 3. Find similar plants
	let recommended = [];
	if (searchTerms.length > 0 || viewedPlantIds.length > 0) {
		// Search by common_name/scientific_name for search terms
		let query = supabase.from('plants').select('*');
		if (searchTerms.length > 0) {
			// Use ILIKE for any search term
			const ilikeFilters = searchTerms.map(term => `or(common_name.ilike.%${term}%,scientific_name.ilike.%${term}%)`).join(',');
			query = supabase.from('plants').select('*').or(ilikeFilters);
		}
		// Add viewed plants if not already in
		if (viewedPlantIds.length > 0) {
			query = query.in ? query.in('id', viewedPlantIds) : query;
		}
		const { data, error } = await query.limit(10);
		if (!error && data) {
			// Remove duplicates, limit to 5
			const seen = new Set();
			recommended = data.filter(p => {
				if (seen.has(p.id)) return false;
				seen.add(p.id); return true;
			}).slice(0, 5);
		}
	}

	// 4. Fallback: random/popular plants
	if (recommended.length === 0) {
		const { data, error } = await supabase
			.from('plants')
			.select('*')
			.order('created_at', { ascending: false })
			.limit(5);
		if (!error && data) recommended = data;
	}
	return recommended;
};
// Contains business logic for plant features
const supabase = require('../config/supabaseClient');

const { logActivity } = require('../utils/activityLogger');

exports.searchPlants = async (q, page = 1, limit = 10, userId = null) => {
	if (userId) logActivity(userId, 'search', { query: q });
	const from = (page - 1) * limit;
	const to = from + limit - 1;
	// Improved search: ILIKE on common_name OR scientific_name
	const query = supabase
		.from('plants')
		.select('*', { count: 'exact' })
		.or(`common_name.ilike.%${q}%,scientific_name.ilike.%${q}%`)
		.range(from, to);
	const { data, error, count } = await query;
	if (error) throw new Error(error.message);
	return { results: data, total: count || 0 };
};

exports.getPlantById = async (id, userId = null) => {
	if (userId) logActivity(userId, 'plant_view', { referenceId: id });
	const { data, error } = await supabase
		.from('plants')
		.select('*')
		.eq('id', id)
		.single();
	if (error && error.code !== 'PGRST116') {
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
