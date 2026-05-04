// backend/src/routes/imageRoutes.js
const express    = require('express');
const router     = express.Router({ mergeParams: true }); // mergeParams để nhận :id từ route cha
const auth       = require('../middleware/authMiddleware');
const upload     = require('../middleware/uploadMiddleware');
const controller = require('../controllers/imageController');

// Xử lý lỗi của multer (file sai định dạng, vượt dung lượng...)
const handleUpload = (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'Lỗi khi upload file',
        data: null,
      });
    }
    next();
  });
};

// POST /api/bikes/:id/images — Upload ảnh (phải đăng nhập, phải là chủ tin đăng)
router.post('/', auth, handleUpload, controller.uploadImages);

// DELETE /api/bikes/:id/images/:imageId — Xóa ảnh (phải đăng nhập, phải là chủ tin đăng)
router.delete('/:imageId', auth, controller.deleteImage);

module.exports = router;