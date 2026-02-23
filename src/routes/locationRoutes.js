const express = require('express');
const locationController = require('../controllers/locationController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, locationController.updateLocation);

module.exports = router;
