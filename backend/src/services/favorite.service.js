// Contains business logic for favorites management
const supabase = require('../config/supabaseClient');

exports.getFavorites = async (userId) => {
	const { data, error } = await supabase
		.from('favorites')
		.select('*')
		.eq('user_id', userId);
	if (error) throw new Error(error.message);
	return data || [];
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
