// backend/src/server.js
const express = require('express');
const path = require('path');
const app = express();

// Cấu hình phục vụ file tĩnh từ thư mục 'static' ở ngoài cùng
app.use(express.static(path.join(__dirname, '../../static')));

app.listen(5000, () => console.log('Server chạy tại http://localhost:5000'));