// backend/src/routes/catalogRoutes.js
const express    = require('express');
const controller = require('../controllers/catalogcontroller');
const router     = express.Router();

router.get('/',      controller.getCategories);
router.get('/stats', controller.getCategoryStats); // Thêm dòng này
router.get('/brands', controller.getBrands);

module.exports = router;