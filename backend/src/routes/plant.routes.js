const express = require('express');
const router = express.Router();

const plantController = require('../controllers/plant.controller');
const upload = require('../config/multer');

// GET /plants/search
router.get('/search', plantController.searchPlants);

// GET /plants/:id
router.get('/:id', plantController.getPlantById);

// POST /plants/identify
router.post('/identify', upload.single('image'), plantController.identifyPlant);

module.exports = router;
