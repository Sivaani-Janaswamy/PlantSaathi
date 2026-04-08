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

exports.identifyPlant = async (image) => {
	// TODO: Implement plant identification logic
};
