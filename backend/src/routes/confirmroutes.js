// backend/src/routes/confirmRoutes.js
const express    = require('express');
const controller = require('../controllers/paymentController');
const router     = express.Router();

// Không cần auth — endpoint này được gọi bởi cổng thanh toán (VNPAY callback)
router.post('/:payment_id/confirm', controller.confirmPayment);

module.exports = router;