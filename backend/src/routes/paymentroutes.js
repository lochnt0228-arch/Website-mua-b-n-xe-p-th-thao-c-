// backend/src/routes/paymentRoutes.js
const express    = require('express');
const controller = require('../controllers/paymentController');
const auth       = require('../middleware/authMiddleware'); // dùng lại từ BE1
const router     = express.Router();

// Tất cả đều cần đăng nhập
router.post('/',                          auth, controller.createOrder);     // Tạo đơn hàng
router.get('/my',                         auth, controller.getMyOrders);     // Lịch sử đơn
router.get('/by-post/:post_id',           auth, controller.getOrderByPostId); // Tìm theo bài đăng
router.get('/:order_id',                  auth, controller.getOrderById);    // Chi tiết đơn
router.put('/:order_id/status',           auth, controller.updateOrderStatus); // Đổi trạng thái
router.delete('/:order_id',              auth, controller.cancelOrder);     // Huỷ đơn

module.exports = router;