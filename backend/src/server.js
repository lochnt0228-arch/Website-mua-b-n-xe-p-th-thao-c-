// backend/src/server.js
const express = require('express');
const path    = require('path');
require('dotenv').config();

const app = express();

// Parse JSON body — thiếu dòng này thì req.body luôn undefined
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, '../../static')));

// ── Routes BE1 ──
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth',          authRoutes); // /api/auth/register, /api/auth/login
app.use('/api/users/profile', userRoutes); // /api/users/profile (GET, PUT)

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server chạy tại http://localhost:${process.env.PORT || 5000}`)
);