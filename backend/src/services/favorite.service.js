// Contains business logic for favorites management
const supabase = require('../config/supabaseClient');

exports.getFavorites = async (userId, page = 1, limit = 10) => {
	const from = (page - 1) * limit;
	const to = from + limit - 1;
	const query = supabase
		.from('favorites')
		.select('*', { count: 'exact' })
		.eq('user_id', userId)
		.range(from, to);
	const { data, error, count } = await query;
	if (error) throw new Error(error.message);
	return { results: data || [], total: count || 0 };
};

exports.createFavorite = async (favoriteData, userId) => {
	const insertData = {
		user_id: userId,
		plant_id: favoriteData.type === 'plant' ? favoriteData.plant_id : null,
		text: favoriteData.type === 'ai' ? favoriteData.text : null,
		type: favoriteData.type
	};
	const { data, error } = await supabase
		.from('favorites')
		.insert([insertData])
		.select()
		.single();
	if (error) throw new Error(error.message);
	return data;
};
