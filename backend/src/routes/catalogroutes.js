// backend/src/routes/catalogRoutes.js
const express    = require('express');
const controller = require('../controllers/catalogController');
const router     = express.Router();

router.get('/categories', controller.getCategories);
router.get('/brands',     controller.getBrands);

module.exports = router;