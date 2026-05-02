// backend/src/controllers/userController.js
const db = require('../db');

// ─────────────────────────────────────────
// GET /api/users/profile — Xem thông tin bản thân
// ─────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id; // từ JWT — authMiddleware đã inject

    const [rows] = await db.query(
      // Không SELECT password_hash — không bao giờ trả mật khẩu về client
      'SELECT user_id, name, email, role, created_at, updated_at FROM users WHERE user_id = ?',
      [user_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy người dùng',
        data: null
      });
    }

    return res.json({
      success: true,
      message: 'Lấy thông tin profile thành công',
      data: rows[0]
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      data: null
    });
  }
};

// ─────────────────────────────────────────
// PUT /api/users/profile — Cập nhật thông tin
// ─────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { name, password } = req.body;

    // Phải có ít nhất 1 trường để cập nhật
    if (!name && !password) {
      return res.status(400).json({
        success: false,
        message: 'Cần ít nhất 1 trường để cập nhật (name hoặc password)',
        data: null
      });
    }

    // Nếu đổi password → phải hash lại bằng bcrypt
    if (password) {
      const bcrypt = require('bcrypt');
      const password_hash = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE users SET password_hash = ? WHERE user_id = ?',
        [password_hash, user_id]
      );
    }

    // Nếu đổi name
    if (name) {
      await db.query(
        'UPDATE users SET name = ? WHERE user_id = ?',
        [name, user_id]
      );
    }

    return res.json({
      success: true,
      message: 'Cập nhật profile thành công',
      data: null
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server',
      data: null
    });
  }
};