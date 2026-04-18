// Contains business logic for favorites management

const supabase = require('../config/supabaseClient');
const logger = require('../utils/logger');

exports.getFavorites = async (userId, page = 1, limit = 10) => {
	const from = (page - 1) * limit;
	const to = from + limit - 1;
	logger.dbQuery('favorites', 'getFavorites');
	const dbStart = Date.now();
	const query = supabase
		.from('favorites')
		.select('*', { count: 'exact' })
		.eq('user_id', userId)
		.range(from, to);
	const { data, error, count } = await query;
	const dbMs = Date.now() - dbStart;
	if (error && error.message !== 'No rows found') {
		logger.dbError(error.message, 'favorites', 'getFavorites');
		logger.dbResponse('favorites', 'getFavorites', false, dbMs);
		throw new Error(error.message);
	}
	logger.dbResponse('favorites', 'getFavorites', true, dbMs);
	return { results: data || [], total: count || 0 };
};

exports.createFavorite = async (favoriteData, userId) => {
	const insertData = {
		user_id: userId,
		plant_id: favoriteData.type === 'plant' ? favoriteData.plant_id : null,
		text: favoriteData.type === 'ai' ? favoriteData.text : null,
		type: favoriteData.type
	};
	logger.dbQuery('favorites', 'insert');
	const dbStart = Date.now();
	const { data, error } = await supabase
		.from('favorites')
		.insert([insertData])
		.select()
		.single();
	const dbMs = Date.now() - dbStart;
	if (error) {
		logger.dbError(error.message, 'favorites', 'insert');
		logger.dbResponse('favorites', 'insert', false, dbMs);
		throw new Error(error.message);
	}
	logger.dbResponse('favorites', 'insert', true, dbMs);
	return data;
};

exports.deleteFavorite = async (favoriteId, userId) => {
	logger.dbQuery('favorites', 'delete');
	const dbStart = Date.now();
	const { data, error } = await supabase
		.from('favorites')
		.delete()
		.eq('id', favoriteId)
		.eq('user_id', userId)
		.select()
		.maybeSingle();
	const dbMs = Date.now() - dbStart;
	if (error) {
		logger.dbError(error.message, 'favorites', 'delete');
		logger.dbResponse('favorites', 'delete', false, dbMs);
		throw new Error(error.message);
	}
	logger.dbResponse('favorites', 'delete', true, dbMs);
	return data || null;
};
