// backend/src/routes/userRoutes.js
const express    = require('express');
const controller = require('../controllers/userController');
const auth       = require('../middleware/authMiddleware'); // từ BE1
const router     = express.Router();

// Protected — bắt buộc có JWT hợp lệ
router.get('/',  auth, controller.getProfile);    // GET  /api/users/profile
router.put('/',  auth, controller.updateProfile); // PUT  /api/users/profile

module.exports = router;