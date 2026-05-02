// backend/src/server.js
const express = require('express');
const path    = require('path');
require('dotenv').config();

<<<<<<< HEAD
// Cho phép Server đọc dữ liệu JSON từ các request POST/PUT (quan trọng để đọc req.body)
app.use(express.json());

// Cấu hình phục vụ file tĩnh từ thư mục 'static' ở ngoài cùng
app.use(express.static(path.join(__dirname, '../../static')));

// ==========================================
// MOCK API - Dành riêng cho FE1 test giao diện
// ==========================================

// Mock API: Đăng nhập
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    
    // Giả lập logic kiểm tra
    if (email === 'test@example.com' && password === '123') {
        return res.json({
            success: true,
            message: 'Đăng nhập thành công (Đây là API giả lập)',
            data: {
                user: { id: 1, name: 'Người Dùng Test', email: email },
                token: 'mock-jwt-token-123456789'
            }
        });
    }

    return res.status(400).json({
        success: false,
        message: 'Sai email hoặc mật khẩu (Thử email: test@example.com / mật khẩu: 123)',
        data: null
    });
});

// Mock API: Đăng ký
app.post('/api/auth/register', (req, res) => {
    const { name, email, password } = req.body;
    // Giả lập logic kiểm tra
    if (email && password && name) {
        return res.json({
            success: true,
            message: 'Đăng ký thành công (Đây là API giả lập)',
            data: {
                user: { id: 2, name: name, email: email },
                token: 'mock-jwt-token-987654321'
            }
        });
    }

    return res.status(400).json({
        success: false,
        message: 'Vui lòng điền đầy đủ thông tin (Tên, Email, Mật khẩu)',
        data: null
    });
});

// Mock API: Profile


app.listen(5000, () => console.log('Server chạy tại http://localhost:5000'));
=======
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../static')));

// ── Routes BE1 ──
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/auth',          authRoutes);
app.use('/api/users/profile', userRoutes);

// ── Routes BE2 ──
const bikeRoutes    = require('./routes/bikeRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
app.use('/api/bikes', bikeRoutes);
app.use('/api',       catalogRoutes);

// ── Routes BE3 (Payment) ──
const paymentRoutes = require('./routes/paymentRoutes');
const confirmRoutes = require('./routes/confirmRoutes');
app.use('/api/orders',   paymentRoutes); // POST /api/orders, GET /api/orders/my, DELETE /api/orders/:id
app.use('/api/payments', confirmRoutes); // POST /api/payments/:id/confirm

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server chạy tại http://localhost:${process.env.PORT || 5000}`)
);
>>>>>>> origin/main
