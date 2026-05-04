const db = require('../db');

// ─────────────────────────────────────────────
// POST /api/orders
// Tạo đơn hàng mới (dùng MySQL Transaction)
// ─────────────────────────────────────────────
const createOrder = async (req, res) => {
  const buyer_id = req.user.user_id; // Lấy từ JWT, không từ body
  const { bike_post_id, quantity = 1 } = req.body;

  if (!bike_post_id) {
    return res.status(400).json({ message: 'bike_post_id là bắt buộc.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Khoá dòng để tránh race condition
    const [posts] = await conn.query(
      'SELECT * FROM bike_posts WHERE id = ? AND status = "available" FOR UPDATE',
      [bike_post_id]
    );

    if (posts.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Sản phẩm không tồn tại hoặc đã hết hàng.' });
    }

    const post = posts[0];

    if (post.stock < quantity) {
      await conn.rollback();
      return res.status(400).json({ message: `Tồn kho không đủ. Còn lại: ${post.stock}` });
    }

    const total_price = post.price * quantity;

    // Ghi đơn hàng
    const [orderResult] = await conn.query(
      `INSERT INTO orders (buyer_id, bike_post_id, quantity, total_price, status, created_at)
       VALUES (?, ?, ?, ?, 'pending', NOW())`,
      [buyer_id, bike_post_id, quantity, total_price]
    );

    const order_id = orderResult.insertId;

    // Cập nhật tồn kho
    const newStock = post.stock - quantity;
    await conn.query(
      `UPDATE bike_posts SET stock = ?, status = ? WHERE id = ?`,
      [newStock, newStock === 0 ? 'sold_out' : 'available', bike_post_id]
    );

    await conn.commit();

    return res.status(201).json({
      message: 'Đặt hàng thành công.',
      order: {
        id: order_id,
        buyer_id,
        bike_post_id,
        quantity,
        total_price,
        status: 'pending',
      },
    });
  } catch (err) {
    await conn.rollback();
    console.error('[createOrder] Error:', err);
    return res.status(500).json({ message: 'Lỗi server khi đặt hàng.', error: err.message });
  } finally {
    conn.release();
  }
};

// ─────────────────────────────────────────────
// GET /api/orders/my
// Lấy danh sách đơn hàng của người dùng hiện tại
// ─────────────────────────────────────────────
const getMyOrders = async (req, res) => {
  const buyer_id = req.user.user_id;

  try {
    const [orders] = await db.query(
      `SELECT o.id, o.quantity, o.total_price, o.status, o.created_at,
              b.title AS bike_title, b.price AS unit_price, b.image_url
       FROM orders o
       JOIN bike_posts b ON o.bike_post_id = b.id
       WHERE o.buyer_id = ?
       ORDER BY o.created_at DESC`,
      [buyer_id]
    );

    return res.status(200).json({ orders });
  } catch (err) {
    console.error('[getMyOrders] Error:', err);
    return res.status(500).json({ message: 'Lỗi server khi lấy danh sách đơn hàng.', error: err.message });
  }
};

// ─────────────────────────────────────────────
// DELETE /api/orders/:id
// Huỷ đơn hàng (chỉ khi status = 'pending')
// ─────────────────────────────────────────────
const cancelOrder = async (req, res) => {
  const buyer_id = req.user.user_id;
  const order_id = req.params.id;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND buyer_id = ? FOR UPDATE',
      [order_id, buyer_id]
    );

    if (orders.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không thuộc về bạn.' });
    }

    const order = orders[0];

    if (order.status !== 'pending') {
      await conn.rollback();
      return res.status(400).json({ message: `Không thể huỷ đơn hàng ở trạng thái "${order.status}".` });
    }

    // Hoàn lại tồn kho
    await conn.query(
      `UPDATE bike_posts SET stock = stock + ?, status = 'available' WHERE id = ?`,
      [order.quantity, order.bike_post_id]
    );

    // Xoá đơn hàng
    await conn.query('DELETE FROM orders WHERE id = ?', [order_id]);

    await conn.commit();

    return res.status(200).json({ message: 'Huỷ đơn hàng thành công.' });
  } catch (err) {
    await conn.rollback();
    console.error('[cancelOrder] Error:', err);
    return res.status(500).json({ message: 'Lỗi server khi huỷ đơn hàng.', error: err.message });
  } finally {
    conn.release();
  }
};

// ─────────────────────────────────────────────
// POST /api/payments/:payment_id/confirm
// Xác nhận thanh toán
// ─────────────────────────────────────────────
const confirmPayment = async (req, res) => {
  const buyer_id    = req.user.user_id;
  const payment_id  = req.params.payment_id;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Khoá dòng payment
    const [payments] = await conn.query(
      'SELECT * FROM payments WHERE id = ? FOR UPDATE',
      [payment_id]
    );

    if (payments.length === 0) {
      await conn.rollback();
      return res.status(404).json({ message: 'Không tìm thấy giao dịch thanh toán.' });
    }

    const payment = payments[0];

    if (payment.status === 'confirmed') {
      await conn.rollback();
      return res.status(400).json({ message: 'Giao dịch này đã được xác nhận trước đó.' });
    }

    // Kiểm tra đơn hàng thuộc buyer_id
    const [orders] = await conn.query(
      'SELECT * FROM orders WHERE id = ? AND buyer_id = ?',
      [payment.order_id, buyer_id]
    );

    if (orders.length === 0) {
      await conn.rollback();
      return res.status(403).json({ message: 'Bạn không có quyền xác nhận giao dịch này.' });
    }

    // Xác nhận payment
    await conn.query(
      `UPDATE payments SET status = 'confirmed', confirmed_at = NOW() WHERE id = ?`,
      [payment_id]
    );

    // Cập nhật trạng thái đơn hàng
    await conn.query(
      `UPDATE orders SET status = 'paid' WHERE id = ?`,
      [payment.order_id]
    );

    await conn.commit();

    return res.status(200).json({ message: 'Xác nhận thanh toán thành công.', payment_id, order_id: payment.order_id });
  } catch (err) {
    await conn.rollback();
    console.error('[confirmPayment] Error:', err);
    return res.status(500).json({ message: 'Lỗi server khi xác nhận thanh toán.', error: err.message });
  } finally {
    conn.release();
  }
};

module.exports = { createOrder, getMyOrders, cancelOrder, confirmPayment };
