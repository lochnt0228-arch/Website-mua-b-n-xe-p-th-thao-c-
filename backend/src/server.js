// backend/src/server.js
const express = require('express');
const path = require('path');
const app = express();

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