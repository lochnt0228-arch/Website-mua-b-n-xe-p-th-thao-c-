const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Đảm bảo thư mục uploads/ tồn tại, nếu chưa có thì tự tạo
const UPLOAD_DIR = path.join(__dirname, '..', '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// ── Cấu hình nơi lưu file ────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Tên file: uploads/bike-<post_id>-<timestamp>.<đuôi>
    // Tránh trùng tên, tránh ký tự đặc biệt
    const ext       = path.extname(file.originalname).toLowerCase();
    const postId    = req.params.id || 'unknown';
    const timestamp = Date.now();
    cb(null, `bike-${postId}-${timestamp}${ext}`);
  },
});

// ── Kiểm tra định dạng file ──────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận ảnh định dạng JPG, PNG hoặc WEBP'), false);
  }
};

// ── Xuất middleware upload ───────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Tối đa 5MB mỗi ảnh
    files: 5,                  // Tối đa 5 ảnh mỗi lần upload
  },
});

module.exports = upload;