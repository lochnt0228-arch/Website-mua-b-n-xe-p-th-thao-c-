// backend/src/controllers/bikeController.js
const db = require('../db');

// POST /api/bikes — Đăng bán xe
exports.createBike = async (req, res) => {
  try {
    // RÀNG BUỘC BE2: seller_id lấy từ JWT, KHÔNG từ req.body
    const seller_id = req.user.user_id;

    const { title, description, price, category_id, brand_id, frame_size, frame_material } = req.body;

    if (!title || !price || !category_id || !brand_id) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: title, price, category_id, brand_id',
        data: null
      });
    }

    const [result] = await db.query(
      `INSERT INTO bike_posts (seller_id, title, description, price, category_id, brand_id, frame_size, frame_material)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [seller_id, title, description || null, price, category_id, brand_id, frame_size || null, frame_material || null]
    );

    return res.status(201).json({
      success: true,
      message: 'Đăng bán xe thành công',
      data: { post_id: result.insertId }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};

// GET /api/bikes — Danh sách xe (có Pagination + Filter)
// RÀNG BUỘC BE2: bắt buộc dùng LIMIT và OFFSET
exports.getBikes = async (req, res) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(50, parseInt(req.query.limit) || 10);
    const offset   = (page - 1) * limit;
    const { category_id, brand_id, keyword } = req.query;

    // Xây WHERE động, vẫn dùng Prepared Statement (dấu ?)
    let where  = ["bp.status = 'AVAILABLE'"];
    let params = [];

    if (category_id) { where.push('bp.category_id = ?'); params.push(category_id); }
    if (brand_id)    { where.push('bp.brand_id = ?');    params.push(brand_id); }
    if (keyword)     { where.push('bp.title LIKE ?');    params.push(`%${keyword}%`); }

    const whereSQL = 'WHERE ' + where.join(' AND ');

    const [rows] = await db.query(
      `SELECT bp.post_id, bp.title, bp.price, bp.status,
              bp.frame_size, bp.frame_material, bp.created_at,
              u.name  AS seller_name,
              c.name  AS category_name,
              b.name  AS brand_name,
              (SELECT image_url FROM bike_images WHERE post_id = bp.post_id AND is_primary = TRUE LIMIT 1) AS image_url
       FROM bike_posts bp
       JOIN users      u ON bp.seller_id   = u.user_id
       JOIN categories c ON bp.category_id = c.category_id
       JOIN brands     b ON bp.brand_id    = b.brand_id
       ${whereSQL}
       ORDER BY bp.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM bike_posts bp ${whereSQL}`,
      params
    );

    return res.json({
      success: true,
      message: 'Lấy danh sách xe thành công',
      data: {
        bikes: rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
      }
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};

// GET /api/bikes/:id — Chi tiết 1 bài đăng
exports.getBikeById = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT bp.*,
              u.name  AS seller_name,
              u.email AS seller_email,
              c.name  AS category_name,
              b.name  AS brand_name
       FROM bike_posts bp
       JOIN users      u ON bp.seller_id   = u.user_id
       JOIN categories c ON bp.category_id = c.category_id
       JOIN brands     b ON bp.brand_id    = b.brand_id
       WHERE bp.post_id = ? AND bp.status != 'HIDDEN'`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài đăng', data: null });
    }

    const bike = rows[0];

    // Lấy danh sách ảnh của xe
    const [images] = await db.query(
      'SELECT image_id, image_url, is_primary FROM bike_images WHERE post_id = ? ORDER BY sort_order ASC',
      [req.params.id]
    );

    bike.images = images;

    return res.json({ success: true, message: 'OK', data: bike });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};

// PUT /api/bikes/:id — Sửa tin đăng (chỉ chủ sở hữu)
exports.updateBike = async (req, res) => {
  try {
    const seller_id = req.user.user_id;

    const [posts] = await db.query(
      'SELECT seller_id FROM bike_posts WHERE post_id = ?',
      [req.params.id]
    );
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài đăng', data: null });
    }
    if (posts[0].seller_id !== seller_id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền sửa bài đăng này', data: null });
    }

    const { title, description, price, category_id, brand_id, frame_size, frame_material, status } = req.body;

    // Chỉ seller được chuyển AVAILABLE ↔ HIDDEN, không tự chuyển sang SOLD
    const allowedStatus = ['AVAILABLE', 'HIDDEN'];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status không hợp lệ. Chỉ chấp nhận: ${allowedStatus.join(', ')}`,
        data: null
      });
    }

    await db.query(
      `UPDATE bike_posts SET
         title          = COALESCE(?, title),
         description    = COALESCE(?, description),
         price          = COALESCE(?, price),
         category_id    = COALESCE(?, category_id),
         brand_id       = COALESCE(?, brand_id),
         frame_size     = COALESCE(?, frame_size),
         frame_material = COALESCE(?, frame_material),
         status         = COALESCE(?, status)
       WHERE post_id = ?`,
      [title, description, price, category_id, brand_id, frame_size, frame_material, status, req.params.id]
    );

    return res.json({ success: true, message: 'Cập nhật bài đăng thành công', data: null });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};

// DELETE /api/bikes/:id — Ẩn tin (soft delete → HIDDEN)
// Lý do không xóa cứng: orders có FK RESTRICT tới post_id, xóa sẽ lỗi
exports.deleteBike = async (req, res) => {
  try {
    const seller_id = req.user.user_id;

    const [posts] = await db.query(
      'SELECT seller_id FROM bike_posts WHERE post_id = ?',
      [req.params.id]
    );
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy bài đăng', data: null });
    }
    if (posts[0].seller_id !== seller_id) {
      return res.status(403).json({ success: false, message: 'Bạn không có quyền xóa bài đăng này', data: null });
    }

    await db.query(
      "UPDATE bike_posts SET status = 'HIDDEN' WHERE post_id = ?",
      [req.params.id]
    );

    return res.json({ success: true, message: 'Đã ẩn bài đăng thành công', data: null });

  } catch (err) {
    return res.status(500).json({ success: false, message: 'Lỗi server', data: null });
  }
};