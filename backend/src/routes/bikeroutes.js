// backend/src/routes/bikeRoutes.js
const express    = require('express');
const controller = require('../controllers/bikecontroller');
const auth       = require('../middleware/authMiddleware'); // dùng lại từ BE1
const router     = express.Router();

router.get('/',      controller.getBikes);           // public
router.get('/:id',   controller.getBikeById);        // public
router.post('/',     auth, controller.createBike);   // cần JWT
router.put('/:id',   auth, controller.updateBike);   // cần JWT
router.delete('/:id', auth, controller.deleteBike);  // cần JWT

module.exports = router;