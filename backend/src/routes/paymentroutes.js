// backend/src/routes/paymentRoutes.js
const express    = require('express');
const controller = require('../controllers/paymentController');
const auth       = require('../middleware/authMiddleware'); // dùng lại từ BE1
const router     = express.Router();

// Tất cả đều cần đăng nhập
router.post('/',                          auth, controller.createOrder);     // Tạo đơn hàng
router.get('/my',                         auth, controller.getMyOrders);     // Lịch sử đơn
router.delete('/:order_id',              auth, controller.cancelOrder);     // Huỷ đơn

module.exports = router;