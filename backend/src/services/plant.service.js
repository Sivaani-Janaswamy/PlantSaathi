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
	// 1. Mock external Plant Identification API call
	// Simulate extracting plant info from image buffer
	// In real use, send image.buffer to API
	// For test/dev, return a fixed plant
	const mockApiResponse = {
		common_name: 'Aloe Vera',
		scientific_name: 'Aloe barbadensis miller',
		image_url: 'https://example.com/aloe.jpg',
		uses: 'Medicinal, ornamental',
		benefits: 'Soothes burns, air purification',
		where_it_grows: 'Tropical, arid regions',
		how_to_grow: 'Well-drained soil, bright light'
	};

	// 2. Check if plant already exists in DB (by scientific_name)
	const { data: existing, error: findError } = await supabase
		.from('plants')
		.select('*')
		.eq('scientific_name', mockApiResponse.scientific_name)
		.single();
	if (findError && findError.code !== 'PGRST116') throw new Error(findError.message);
	if (existing) return existing;

	// 3. Insert new plant if not found
	const insertPayload = {
		common_name: mockApiResponse.common_name,
		scientific_name: mockApiResponse.scientific_name,
		image_url: mockApiResponse.image_url,
		uses: mockApiResponse.uses,
		benefits: mockApiResponse.benefits,
		where_it_grows: mockApiResponse.where_it_grows,
		how_to_grow: mockApiResponse.how_to_grow
	};
	const { data: created, error: insertError } = await supabase
		.from('plants')
		.insert([insertPayload])
		.select()
		.single();
	if (insertError) throw new Error(insertError.message);
	return created;
};
