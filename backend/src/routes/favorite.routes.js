const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const auth = require('../middlewares/auth.middleware');


router.get('/', auth, favoriteController.getFavorites);
router.post('/', auth, favoriteController.addFavorite);

module.exports = router;
