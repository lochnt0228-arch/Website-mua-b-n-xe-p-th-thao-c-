// register
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Thiếu thông tin', data: null });
    }

    // Prepared Statement — chống SQL Injection
    const [existing] = await pool.query(
      'SELECT user_id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email đã tồn tại', data: null });
    }

    // bcrypt — bắt buộc theo ràng buộc BE1
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)',
      [name, email, password_hash]
    );

    return res.status(201).json({ success: true, message: 'Đăng ký thành công', data: { user_id: result.insertId } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};
// login

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu', data: null });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Sai email hoặc mật khẩu', data: null });
    }

    // TRỌNG TÂM: Payload JWT bắt buộc có user_id — BE2, BE3 sẽ dùng cái này
    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({ success: true, message: 'Đăng nhập thành công', data: { token } });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};