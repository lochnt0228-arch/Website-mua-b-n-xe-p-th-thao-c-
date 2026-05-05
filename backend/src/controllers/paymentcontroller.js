// backend/src/controllers/paymentController.js
const db = require('../db');

// ─────────────────────────────────────────────────────────────
// POST /api/orders — Tạo đơn hàng + payment (Transaction)
// Luồng: bike_post AVAILABLE → tạo order → tạo payment → post = PENDING
// ─────────────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  const buyer_id = req.user.user_id; // từ JWT, không từ body
  const { post_id, shipping_address, payment_method } = req.body;

  // Validate đầu vào
  if (!post_id || !shipping_address || !payment_method) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin: post_id, shipping_address, payment_method',
      data: null
    });
  }

  const validMethods = ['COD', 'VNPAY', 'BANK_TRANSFER'];
  if (!validMethods.includes(payment_method)) {
    return res.status(400).json({
      success: false,
      message: `Phương thức thanh toán không hợp lệ. Chỉ chấp nhận: ${validMethods.join(', ')}`,
      data: null
    });
  }

  // Lấy connection riêng để dùng transaction
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction(); // ← BEGIN

    // 1. Kiểm tra bài đăng còn AVAILABLE không (FOR UPDATE: khóa dòng, chống race condition)
    const [posts] = await conn.query(
      "SELECT * FROM bike_posts WHERE post_id = ? AND status = 'AVAILABLE' FOR UPDATE",
      [post_id]
    );

    if (posts.length === 0) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: 'Xe không còn khả dụng hoặc không tồn tại',
        data: null
      });
    }

    const post = posts[0];

    // 2. Ngăn người bán tự mua xe của chính mình
    if (post.seller_id === buyer_id) {
      await conn.rollback();
      return res.status(400).json({
        success: false,
        message: 'Bạn không thể mua xe của chính mình',
        data: null
      });
    }

    const shipping_fee = 50000; // phí ship cố định 50k, có thể mở rộng sau

    // 3. Tạo đơn hàng
    const [orderResult] = await conn.query(
      `INSERT INTO orders (buyer_id, post_id, price, shipping_address, shipping_fee, status)
       VALUES (?, ?, ?, ?, ?, 'PENDING')`,
      [buyer_id, post_id, post.price, shipping_address, shipping_fee]
    );

    const order_id = orderResult.insertId;

    // 4. Tạo bản ghi thanh toán tương ứng
    // COD: payment thành công ngay — giao hàng thu tiền
    // VNPAY/BANK_TRANSFER: PENDING — chờ xác nhận từ cổng thanh toán
    const payment_status = payment_method === 'COD' ? 'SUCCESS' : 'PENDING';
    const paid_at = payment_method === 'COD' ? new Date() : null;

    const [paymentResult] = await conn.query(
      `INSERT INTO payments (order_id, payment_method, amount, payment_status, paid_at)
       VALUES (?, ?, ?, ?, ?)`,
      [order_id, payment_method, post.price + shipping_fee, payment_status, paid_at]
    );

    // 5. Chuyển trạng thái bài đăng sang PENDING (đang chờ thanh toán/giao hàng)
    // Không chuyển thẳng SOLD vì VNPAY/BANK_TRANSFER có thể thất bại
    await conn.query(
      "UPDATE bike_posts SET status = 'PENDING' WHERE post_id = ?",
      [post_id]
    );

    await conn.commit(); // ← COMMIT — lưu tất cả nếu 3 bước trên đều OK

    return res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: {
        order_id,
        payment_id: paymentResult.insertId,
        total_amount: Number(post.price) + Number(shipping_fee),
        payment_status
      }
    });

  } catch (err) {
    await conn.rollback(); // ← ROLLBACK — hủy toàn bộ nếu có lỗi bất kỳ
    return res.status(500).json({
      success: false,
      message: 'Đặt hàng thất bại',
      data: null
    });
  } finally {
    conn.release(); // ← trả connection về pool
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/payments/:payment_id/confirm
// Xác nhận thanh toán thành công (VNPAY/BANK_TRANSFER callback)
// Trong thực tế: endpoint này được gọi bởi cổng thanh toán, không phải FE
// ─────────────────────────────────────────────────────────────
exports.confirmPayment = async (req, res) => {
  const { payment_id } = req.params;
  const { transaction_code } = req.body;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    // Lấy thông tin payment và order liên quan
    const [payments] = await conn.query(
      `SELECT p.*, o.post_id FROM payments p
       JOIN orders o ON p.order_id = o.order_id
       WHERE p.payment_id = ? AND p.payment_status = 'PENDING'`,
      [payment_id]
    );

    if (payments.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy giao dịch hoặc giao dịch đã được xử lý',
        data: null
      });
    }

    const payment = payments[0];

    // Cập nhật payment → SUCCESS
    await conn.query(
      `UPDATE payments
       SET payment_status = 'SUCCESS', transaction_code = ?, paid_at = NOW()
       WHERE payment_id = ?`,
      [transaction_code || null, payment_id]
    );

    // Cập nhật order → PAID
    await conn.query(
      "UPDATE orders SET status = 'PAID' WHERE order_id = ?",
      [payment.order_id]
    );

    // Cập nhật bài đăng → SOLD (xe đã có người mua và đã thanh toán)
    await conn.query(
      "UPDATE bike_posts SET status = 'SOLD' WHERE post_id = ?",
      [payment.post_id]
    );

    await conn.commit();

    return res.json({
      success: true,
      message: 'Xác nhận thanh toán thành công',
      data: { order_id: payment.order_id }
    });

  } catch (err) {
    await conn.rollback();
    return res.status(500).json({
      success: false,
      message: 'Xác nhận thất bại',
      data: null
    });
  } finally {
    conn.release();
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/orders/my — Lịch sử đơn hàng của người dùng hiện tại
// ─────────────────────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const buyer_id = req.user.user_id;

    const [rows] = await db.query(
      `SELECT
         o.order_id, o.price, o.shipping_fee, o.status AS order_status,
         o.shipping_address, o.created_at,
         bp.title AS bike_title, bp.post_id,
         u.name  AS seller_name,
         p.payment_method, p.payment_status, p.paid_at
       FROM orders o
       JOIN bike_posts bp ON o.post_id    = bp.post_id
       JOIN users      u  ON bp.seller_id = u.user_id
       LEFT JOIN payments p ON o.order_id = p.order_id
       WHERE o.buyer_id = ?
       ORDER BY o.created_at DESC`,
      [buyer_id]
    );

    return res.json({
      success: true,
      message: 'OK',
      data: rows
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      data: null
    });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE /api/orders/:order_id — Huỷ đơn hàng
// Chỉ cho phép huỷ khi còn PENDING (chưa thanh toán)
// ─────────────────────────────────────────────────────────────
exports.cancelOrder = async (req, res) => {
  const buyer_id = req.user.user_id;
  const { order_id } = req.params;

  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [orders] = await conn.query(
      "SELECT * FROM orders WHERE order_id = ? AND status = 'PENDING'",
      [order_id]
    );

    if (orders.length === 0) {
      await conn.rollback();
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng hoặc đơn hàng không thể huỷ',
        data: null
      });
    }

    const order = orders[0];

    // Chỉ người đặt mới được huỷ
    if (order.buyer_id !== buyer_id) {
      await conn.rollback();
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền huỷ đơn hàng này',
        data: null
      });
    }

    // Huỷ order
    await conn.query(
      "UPDATE orders SET status = 'CANCELLED' WHERE order_id = ?",
      [order_id]
    );

    // Huỷ payment tương ứng
    await conn.query(
      "UPDATE payments SET payment_status = 'FAILED' WHERE order_id = ? AND payment_status = 'PENDING'",
      [order_id]
    );

    // Trả xe về AVAILABLE để người khác có thể mua lại
    await conn.query(
      "UPDATE bike_posts SET status = 'AVAILABLE' WHERE post_id = ?",
      [order.post_id]
    );

    await conn.commit();

    return res.json({
      success: true,
      message: 'Huỷ đơn hàng thành công',
      data: null
    });

  } catch (err) {
    await conn.rollback();
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      data: null
    });
  } finally {
    conn.release();
  }
};

// GET /api/orders/:order_id — Chi tiết 1 đơn hàng
exports.getOrderById = async (req, res) => {
  const { order_id } = req.params;
  const user_id = req.user.user_id;

  try {
    const [rows] = await db.query(
      `SELECT 
         o.*, 
         bp.title AS bike_title, bp.seller_id,
         u_buyer.name AS buyer_name, u_buyer.email AS buyer_email,
         u_seller.name AS seller_name, u_seller.email AS seller_email,
         (SELECT image_url FROM bike_images WHERE post_id = bp.post_id LIMIT 1) AS image_url
       FROM orders o
       JOIN bike_posts bp ON o.post_id = bp.post_id
       JOIN users u_buyer ON o.buyer_id = u_buyer.user_id
       JOIN users u_seller ON bp.seller_id = u_seller.user_id
       WHERE o.order_id = ?`,
      [order_id]
    );

    const order = rows[0];

    // Tách chuỗi shipping_address: "Tên - SĐT - Địa chỉ"
    const addrParts = order.shipping_address.split(' - ');
    order.display_name = addrParts[0] || order.buyer_name;
    order.display_phone = addrParts[1] || 'Chưa cập nhật';
    order.display_address = addrParts[2] || order.shipping_address;

    if (order.buyer_id !== user_id && order.seller_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem đơn hàng này' });
    }
    return res.json({ success: true, message: 'OK', data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// PUT /api/orders/:order_id/status — Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  const { order_id } = req.params;
  const { status } = req.body;
  const user_id = req.user.user_id;

  try {
    const [orders] = await db.query(
      `SELECT o.*, bp.seller_id FROM orders o 
       JOIN bike_posts bp ON o.post_id = bp.post_id 
       WHERE o.order_id = ?`,
      [order_id]
    );

    if (orders.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
    const order = orders[0];
    if (order.seller_id !== user_id) return res.status(403).json({ success: false, message: 'Chỉ người bán mới có quyền cập nhật' });

    await db.query("UPDATE orders SET status = ? WHERE order_id = ?", [status, order_id]);
    if (status === 'COMPLETED') await db.query("UPDATE bike_posts SET status = 'SOLD' WHERE post_id = ?", [order.post_id]);
    if (status === 'CANCELLED') await db.query("UPDATE bike_posts SET status = 'AVAILABLE' WHERE post_id = ?", [order.post_id]);

    return res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/orders/by-post/:post_id — Tìm đơn hàng theo mã bài đăng (Dùng cho người bán)
exports.getOrderByPostId = async (req, res) => {
  const { post_id } = req.params;
  const user_id = req.user.user_id;

  try {
    const [rows] = await db.query(
      `SELECT 
         o.*, 
         bp.title AS bike_title, bp.seller_id,
         u_buyer.name AS buyer_name, u_buyer.email AS buyer_email,
         u_seller.name AS seller_name, u_seller.email AS seller_email,
         (SELECT image_url FROM bike_images WHERE post_id = bp.post_id LIMIT 1) AS image_url
       FROM orders o
       JOIN bike_posts bp ON o.post_id = bp.post_id
       JOIN users u_buyer ON o.buyer_id = u_buyer.user_id
       JOIN users u_seller ON bp.seller_id = u_seller.user_id
       WHERE o.post_id = ? AND o.status != 'CANCELLED'
       ORDER BY o.created_at DESC LIMIT 1`,
      [post_id]
    );

    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng cho bài đăng này' });
    const order = rows[0];

    // Tách chuỗi shipping_address: "Tên - SĐT - Địa chỉ"
    const addrParts = order.shipping_address.split(' - ');
    order.display_name = addrParts[0] || order.buyer_name;
    order.display_phone = addrParts[1] || 'Chưa cập nhật';
    order.display_address = addrParts[2] || order.shipping_address;

    if (order.seller_id !== user_id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xem đơn hàng này' });
    }
    return res.json({ success: true, message: 'OK', data: order });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};