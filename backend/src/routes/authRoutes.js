// backend/src/routes/authRoutes.js
const express    = require('express');
const controller = require('../controllers/authController');
const router     = express.Router();

// Public — không cần JWT
router.post('/register', controller.register);
router.post('/login',    controller.login);

module.exports = router;