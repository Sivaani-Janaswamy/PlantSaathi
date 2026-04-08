const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const auth = require('../middlewares/auth.middleware');

// GET /favorites (protected)
router.get('/', auth, favoriteController.getFavorites);

// POST /favorites (protected)
router.post('/', auth, favoriteController.addFavorite);

module.exports = router;
