// backend/src/server.js
const express = require('express');
const path    = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..', 'static')));
// Phục vụ ảnh upload: truy cập qua /uploads/<tên-file>
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

// ── Routes BE1 ──
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
app.use('/api/auth',          authRoutes);
app.use('/api/users/profile', userRoutes);

// ── Routes BE2 ──
const bikeRoutes    = require('./routes/bikeRoutes.js');
const catalogRoutes = require('./routes/catalogRoutes.js');
const imageRoutes   = require('./routes/imageRoutes.js');
app.use('/api/bikes', bikeRoutes);
app.use('/api/bikes/:id/images', imageRoutes); // POST & DELETE ảnh của tin đăng
app.use('/api',       catalogRoutes);

// ── Routes BE3 (Payment) ──
const paymentRoutes = require('./routes/paymentRoutes.js');
const confirmRoutes = require('./routes/confirmRoutes.js');
app.use('/api/orders',   paymentRoutes); // POST /api/orders, GET /api/orders/my, DELETE /api/orders/:id
app.use('/api/payments', confirmRoutes); // POST /api/payments/:id/confirm

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server chạy tại http://localhost:${process.env.PORT || 5000}`)
);