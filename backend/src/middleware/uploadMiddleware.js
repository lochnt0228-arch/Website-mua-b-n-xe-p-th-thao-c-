const multer = require('multer');
const path   = require('path');
const fs     = require('fs');

// Trong Docker, chúng ta mount ./uploads vào /uploads của container
const UPLOAD_DIR = process.env.NODE_ENV === 'production' ? '/uploads' : path.join(__dirname, '..', '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (e) {
    console.log('Thư mục upload đã sẵn sàng hoặc đang dùng volume mount');
  }
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