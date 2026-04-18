// be3-orders/routes/orders.js
const express        = require('express');
const db             = require('../../shared/db');
const authMiddleware = require('../../shared/authMiddleware');
const router         = express.Router();

// POST /api/orders — tạo đơn hàng
router.post('/', authMiddleware, async (req, res) => {
  const buyer_id = req.user.user_id; // ← từ JWT, không từ body
  const { bike_id, quantity } = req.body;

  // Lấy connection riêng để dùng transaction
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction(); // ← BEGIN

    // 1. Kiểm tra xe còn hàng không (FOR UPDATE: khóa dòng để tránh race condition)
    const [bikes] = await conn.query(
      'SELECT * FROM bikes WHERE id = ? AND status = "available" FOR UPDATE',
      [bike_id]
    );

    if (bikes.length === 0) {
      await conn.rollback();
      return res.status(400).json({ error: 'Xe không còn hàng' });
    }

    const bike = bikes[0];
    if (bike.quantity < quantity) {
      await conn.rollback();
      return res.status(400).json({ error: 'Không đủ số lượng' });
    }

    const total_price = bike.price * quantity;

    // 2. Tạo đơn hàng
    await conn.query(
      'INSERT INTO orders (buyer_id, bike_id, quantity, total_price) VALUES (?, ?, ?, ?)',
      [buyer_id, bike_id, quantity, total_price]
    );

    // 3. Trừ tồn kho
    const newQty = bike.quantity - quantity;
    await conn.query(
      'UPDATE bikes SET quantity = ?, status = ? WHERE id = ?',
      [newQty, newQty === 0 ? 'sold' : 'available', bike_id]
    );

    await conn.commit(); // ← COMMIT — chỉ lưu nếu cả 2 đều OK

    res.json({ message: 'Đặt hàng thành công', total_price });

  } catch (err) {
    await conn.rollback(); // ← ROLLBACK — hủy tất cả nếu có lỗi
    res.status(500).json({ error: 'Đặt hàng thất bại', detail: err.message });
  } finally {
    conn.release(); // ← trả connection về pool
  }
});

module.exports = router;