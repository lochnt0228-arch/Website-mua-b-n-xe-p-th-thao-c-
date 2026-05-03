// backend/src/controllers/imageController.js
const db   = require('../db');
const fs   = require('fs');
const path = require('path');

// POST /api/bikes/:id/images — Upload ảnh cho tin đăng
exports.uploadImages = async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.user_id;

  try {
    // Kiểm tra tin đăng có tồn tại và thuộc về người dùng này không
    const [posts] = await db.query(
      'SELECT post_id, seller_id FROM bike_posts WHERE post_id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy tin đăng',
        data: null,
      });
    }

    if (posts[0].seller_id !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền thêm ảnh cho tin đăng này',
        data: null,
      });
    }

    // Kiểm tra có file nào được upload không
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn ít nhất 1 ảnh để upload',
        data: null,
      });
    }

    // Kiểm tra tổng số ảnh hiện tại — không được vượt quá 5 ảnh
    const [existing] = await db.query(
      'SELECT COUNT(*) AS total FROM bike_images WHERE post_id = ?',
      [postId]
    );
    const currentTotal = existing[0].total;

    if (currentTotal + req.files.length > 5) {
      // Xóa các file vừa upload vì không dùng được
      req.files.forEach(f => fs.unlink(f.path, () => {}));
      return res.status(400).json({
        success: false,
        message: `Tin đăng đã có ${currentTotal} ảnh. Mỗi tin chỉ được tối đa 5 ảnh.`,
        data: null,
      });
    }

    // Ảnh đầu tiên của tin đăng sẽ là ảnh đại diện (is_primary = true)
    const isFirstUpload = currentTotal === 0;

    // Lưu thông tin từng ảnh vào database
    const insertedImages = [];

    for (let i = 0; i < req.files.length; i++) {
      const file      = req.files[i];
      // URL truy cập ảnh từ phía client
      const imageUrl  = `/uploads/${file.filename}`;
      const isPrimary = isFirstUpload && i === 0; // Chỉ ảnh đầu tiên của lần upload đầu tiên

      const [result] = await db.query(
        `INSERT INTO bike_images (post_id, image_url, is_primary, sort_order)
         VALUES (?, ?, ?, ?)`,
        [postId, imageUrl, isPrimary, currentTotal + i]
      );

      insertedImages.push({
        image_id:   result.insertId,
        image_url:  imageUrl,
        is_primary: isPrimary,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Upload thành công ${insertedImages.length} ảnh`,
      data: { images: insertedImages },
    });

  } catch (err) {
    // Nếu lỗi DB, xóa các file đã lưu để tránh file rác
    if (req.files) {
      req.files.forEach(f => fs.unlink(f.path, () => {}));
    }
    console.error('[imageController.uploadImages]', err);
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi upload ảnh',
      data: null,
    });
  }
};

// DELETE /api/bikes/:id/images/:imageId — Xóa 1 ảnh
exports.deleteImage = async (req, res) => {
  const { id: postId, imageId } = req.params;
  const userId = req.user.user_id;

  try {
    // Kiểm tra quyền sở hữu tin đăng
    const [posts] = await db.query(
      'SELECT seller_id FROM bike_posts WHERE post_id = ?',
      [postId]
    );

    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy tin đăng', data: null });
    }

    if (posts[0].seller_id !== userId) {
      return res.status(403).json({ success: false, message: 'Không có quyền xóa ảnh này', data: null });
    }

    // Lấy thông tin ảnh cần xóa
    const [images] = await db.query(
      'SELECT * FROM bike_images WHERE image_id = ? AND post_id = ?',
      [imageId, postId]
    );

    if (images.length === 0) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy ảnh', data: null });
    }

    const image = images[0];

    // Xóa file vật lý khỏi disk
    const filePath = path.join(__dirname, '..', '..', '..', 'uploads', path.basename(image.image_url));
    fs.unlink(filePath, () => {}); // Bỏ qua lỗi nếu file không tồn tại

    // Xóa record trong DB
    await db.query('DELETE FROM bike_images WHERE image_id = ?', [imageId]);

    // Nếu ảnh bị xóa là ảnh đại diện → tự động đặt ảnh tiếp theo làm đại diện
    if (image.is_primary) {
      await db.query(
        `UPDATE bike_images SET is_primary = TRUE
         WHERE post_id = ? ORDER BY sort_order ASC LIMIT 1`,
        [postId]
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Xóa ảnh thành công',
      data: null,
    });

  } catch (err) {
    console.error('[imageController.deleteImage]', err);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xóa ảnh', data: null });
  }
};