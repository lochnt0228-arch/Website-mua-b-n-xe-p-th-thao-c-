// backend/src/controllers/catalogController.js
const db = require('../db');

// Lấy danh sách Categories kèm số lượng xe
exports.getCategoryStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT c.category_id, c.name, COUNT(bp.post_id) as total_items
      FROM categories c
      LEFT JOIN bike_posts bp ON c.category_id = bp.category_id AND bp.status = 'AVAILABLE'
      GROUP BY c.category_id
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY category_id');
    return res.json({ success: true, message: 'OK', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};

// GET /api/brands
exports.getBrands = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM brands ORDER BY brand_id');
    return res.json({ success: true, message: 'OK', data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};