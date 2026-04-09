// Initializes and exports Supabase client instance
const { createClient } = require('@supabase/supabase-js');
if (process.env.NODE_ENV !== 'test') {
	require('dotenv').config();
}

let supabase;
if (process.env.NODE_ENV === 'test') {
	// Provide a mockable supabase client for tests (plain object, no jest.fn)
	supabase = {
		from: () => ({
			select: () => ({ eq: () => ({ data: [], error: null }) }),
			insert: () => ({ select: () => ({ single: () => ({ data: {}, error: null }) }) })
		}),
		auth: {
			getUser: async (token) => ({ data: { user: { id: 'user-123' } }, error: null })
		}
	};
} else {
	supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

module.exports = supabase;
