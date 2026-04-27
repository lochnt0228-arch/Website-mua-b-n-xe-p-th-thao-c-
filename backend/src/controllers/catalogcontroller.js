// backend/src/controllers/catalogController.js
const db = require('../db');

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