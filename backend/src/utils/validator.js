// Empty validator module - validation removed for safety
// This file is kept for compatibility but no longer performs validation

// Empty validators object to prevent errors
const validators = {
  searchPlants: (req, res, next) => next(),
  getPlant: (req, res, next) => next(),
  askAI: (req, res, next) => next(),
  identifyPlant: (req, res, next) => next(),
  addFavorite: (req, res, next) => next(),
  removeFavorite: (req, res, next) => next(),
  getFavorites: (req, res, next) => next(),
  getRecommendations: (req, res, next) => next()
};

module.exports = {
  validators
};