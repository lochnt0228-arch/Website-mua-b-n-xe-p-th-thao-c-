# 🚲 Website Mua Bán Xe Đạp Thể Thao Cũ – Phân Công & Hướng Dẫn

Dự án là nền tảng chợ mua bán xe đạp cũ theo mô hình **C2C (Consumer-to-Consumer)**. Bất kỳ người dùng nào sau khi đăng ký và đăng nhập đều có thể trở thành **Người bán** hoặc **Người mua**.

---

## 1. Phân Công Công Việc

Dự án được phân chia thành 3 phần chính để tránh xung đột code:

### **BE 1 – Xác Thực & Quản Lý Người Dùng**
**Phụ trách:** Đăng ký, đăng nhập, quản lý profile, bảo mật

**Nhiệm vụ chính:**
- API đăng ký (`POST /api/auth/register`)
- API đăng nhập (`POST /api/auth/login`) – cấp JWT token
- API lấy profile (`GET /api/users/profile`)
- API cập nhật profile (`PUT /api/users/profile`)
- Hash mật khẩu bằng **bcrypt**
- Xác thực JWT cho các route bảo mật
- Validate dữ liệu input

**File chính:**
- `backend/controllers/authController.js`
- `backend/controllers/userController.js`
- `backend/routes/authRoutes.js`
- `backend/routes/userRoutes.js`
- `backend/middleware/authMiddleware.js`

---

### **BE 2 – Quản Lý Tin Đăng & Catalog**
**Phụ trách:** Xe đạp, danh mục, thương hiệu, tìm kiếm

**Nhiệm vụ chính:**
- API lấy danh sách xe (`GET /api/bikes`)
- API lấy chi tiết xe (`GET /api/bikes/:id`)
- API tạo tin đăng (`POST /api/bikes` – JWT)
- API cập nhật tin (`PUT /api/bikes/:id` – JWT)
- API xóa tin (`DELETE /api/bikes/:id` – JWT)
- Lấy danh mục (`GET /api`)
- Lấy thương hiệu (`GET /api/brands`)
- Thống kê (`GET /api/stats`)
- Xử lý filter, sort, search

**File chính:**
- `backend/controllers/bikeController.js`
- `backend/controllers/catalogController.js`
- `backend/routes/bikeRoutes.js`
- `backend/routes/catalogRoutes.js`

---

### **BE 3 – Đơn Hàng & Thanh Toán**
**Phụ trách:** Tạo đơn, quản lý trạng thái, thanh toán

**Nhiệm vụ chính:**
- API tạo đơn hàng (`POST /api/orders` – JWT)
- API lấy đơn hàng (`GET /api/orders/my` – JWT)
- API lấy chi tiết (`GET /api/orders/:order_id` – JWT)
- API cập nhật trạng thái (`PUT /api/orders/:order_id/status` – JWT)
- API hủy đơn (`DELETE /api/orders/:order_id` – JWT)
- API xác nhận thanh toán (`POST /api/payments/:payment_id/confirm`)
- Xử lý callback từ cổng thanh toán

**File chính:**
- `backend/controllers/paymentController.js`
- `backend/routes/paymentRoutes.js`
- `backend/routes/confirmRoutes.js`

---

### **FE – Giao Diện Người Dùng**
**Phụ trách:** HTML, CSS, PHP, JavaScript, tương tác với API

**Nhiệm vụ chính:**
- Trang đăng nhập / đăng ký
- Trang chủ, danh sách xe
- Trang chi tiết sản phẩm
- Trang bán xe (tạo tin đăng)
- Quản lý tin của tôi
- Giỏ hàng / checkout
- Quản lý đơn hàng
- Upload ảnh sản phẩm
- Kết nối Socket.IO cho real-time updates
- Lưu JWT vào localStorage

**File chính:**
- `static/js/api.js` – wrapper gọi API + JWT
- `static/js/auth.js` – xử lý đăng nhập/đăng ký
- `static/js/index.js` – trang chủ
- `static/js/product-details.js` – chi tiết sản phẩm
- `static/js/sell.js` – tạo tin đăng
- `static/js/my-ads.js` – quản lý tin
- `static/js/checkout.js` – thanh toán
- `static/js/my-orders.js` – quản lý đơn

---


## 2. Cấu Trúc Dự Án

```
./
├── backend/
│   ├── src/
│   │   ├── server.js                 # Entry point
│   │   ├── db.js                     # MySQL connection pool
│   │   ├── controllers/
│   │   │   ├── authController.js     # BE 1
│   │   │   ├── userController.js     # BE 1
│   │   │   ├── bikeController.js     # BE 2
│   │   │   ├── catalogController.js  # BE 2
│   │   │   ├── imageController.js    # Upload ảnh
│   │   │   └── paymentController.js  # BE 3
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # BE 1
│   │   │   ├── userRoutes.js         # BE 1
│   │   │   ├── bikeRoutes.js         # BE 2
│   │   │   ├── catalogRoutes.js      # BE 2
│   │   │   ├── imageRoutes.js        # Upload ảnh
│   │   │   ├── paymentRoutes.js      # BE 3
│   │   │   └── confirmRoutes.js      # BE 3
│   │   └── middleware/
│   │       ├── authMiddleware.js     # Xác thực JWT
│   │       └── uploadMiddleware.js   # Xử lý upload ảnh
│   ├── database/
│   │   └── init.sql                  # Schema database
│   ├── Dockerfile
│   ├── package.json
│   ├── .env.example
│   
│
├── static/                           # Frontend tĩnh
│   ├── assets/                       # CSS, fonts, images gốc
│   ├── css/
│   │   └── style.css                 # CSS tùy chỉnh
│   ├── js/
│   │   ├── api.js                    # [CỐT LÕI] Wrapper gọi API + JWT
│   │   ├── auth.js                   # Xử lý auth
│   │   ├── index.js                  # Trang chủ
│   │   ├── product-details.js        # Chi tiết sản phẩm
│   │   ├── sell.js                   # Tạo tin đăng
│   │   ├── my-ads.js                 # Quản lý tin
│   │   ├── checkout.js               # Thanh toán
│   │   └── my-orders.js              # Quản lý đơn
│   ├── includes/
│   │   ├── header.php                # Header chung
│   │   └── footer.php                # Footer chung
│   └── *.php                         # Các trang
│
├── uploads/                          # Ảnh upload từ users
├── docker-compose.yml                # Docker config
└── README.md                         # Tài liệu dự án
```

---

## 3. Công Nghệ Sử Dụng

### **Frontend**
- **PHP** - Xử lý logic và render HTML
- **HTML5 + CSS3 + JavaScript** (Vanilla)
- **Bootstrap** – Framework CSS
- **Fetch API** – Gọi API backend
- **localStorage** – Lưu JWT token

### **Backend**
- **Node.js** v18+
- **Express.js** v5 – Web framework
- **MySQL** v8+ – Database quan hệ
- **mysql2/promise** – Driver MySQL
- **bcrypt** – Hash mật khẩu
- **jsonwebtoken** – JWT authentication
- **multer** – Upload ảnh
- **dotenv** – Quản lý biến môi trường
- **Docker** – Containerization

### **Lý do chọn công nghệ này**
✅ JavaScript toàn stack → dễ chia việc, dễ debug  
✅ Express nhẹ, dễ học, phù hợp đồ án  
✅ MySQL đảm bảo ACID cho giao dịch mua bán  
✅ Docker giúp chạy uniform trên mọi máy  
✅ JWT đơn giản, không cần session backend  

---

## 4. API Contracts (Hợp Đồng API)

### **Xác Thực – BE 1**
```
POST /api/auth/register
POST /api/auth/login
```

### **Người Dùng – BE 1**
```
GET  /api/users/profile
PUT  /api/users/profile
```

### **Tin Đăng – BE 2**
```
GET    /api/bikes
GET    /api/bikes/:id
POST   /api/bikes              (JWT)
PUT    /api/bikes/:id          (JWT)
DELETE /api/bikes/:id          (JWT)
```

### **Upload Ảnh – BE 2**
```
POST   /api/bikes/:id/images        (JWT)
DELETE /api/bikes/:id/images/:imgId (JWT)
```

### **Danh Mục & Thương Hiệu – BE 2**
```
GET /api
GET /api/brands
GET /api/stats
```

### **Đơn Hàng – BE 3**
```
POST   /api/orders                   (JWT)
GET    /api/orders/my                (JWT)
GET    /api/orders/:order_id         (JWT)
PUT    /api/orders/:order_id/status  (JWT)
DELETE /api/orders/:order_id         (JWT)
```

### **Thanh Toán – BE 3**
```
POST /api/payments/:payment_id/confirm  (Callback)
```

### **Format Response (Bắt buộc toàn team)**
```json
// Thành công
{ "success": true, "message": "...", "data": { } }

// Thất bại
{ "success": false, "message": "Lý do lỗi", "data": null }
```

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### **Yêu Cầu Hệ Thống**
- **Node.js**: v18+
- **MySQL**: v8+
- **NPM**: v6+
- **Docker**: (optional, nhưng khuyến khích)
- **Trình duyệt**: Chrome, Firefox, Edge (mới nhất)

### **Cách 1: Chạy bằng Docker Compose (Khuyến khích)**

```bash
# 1. Clone dự án
git clone <repository-url>
cd "Website mua ban xe dap the thao cu"

# 2. Build & chạy
docker compose up --build -d

# 3. Truy cập : http://localhost:8080

```

### **Cách 2: Chạy Local (Development)**

```bash
# 1. Cài đặt dependencies backend
cd backend
npm install

# 2. Sao chép biến môi trường
cp .env.example .env

# 3. Chỉnh sửa .env theo MySQL của bạn
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=bike_marketplace

# 4. Khởi tạo database
mysql -u root -p < database/init.sql

# 5. Chạy server
npm start

# Server chạy tại http://localhost:5000
```


## 🔧 Biến Môi Trường (.env)

Sao chép `backend/.env.example` thành `backend/.env`:

```env
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bike_marketplace

# JWT
JWT_SECRET=your_super_secret_key_here_minimum_32_chars
JWT_EXPIRES_IN=1d

# Upload
MAX_FILE_SIZE_MB=5
MAX_FILES_PER_POST=5
```

---

## 📖 Hướng Dẫn Sử Dụng Website

### **1. Đăng Ký & Đăng Nhập**
- Tạo tài khoản mới tại `localhost:8080/register.php`
- Email dùng để khôi phục mật khẩu
- Password tối thiểu 6 ký tự

### **2. Trang Chủ & Tìm Kiếm**
- Xem danh sách xe đạp các loại
- Filter theo danh mục, giá, thương hiệu
- Tìm kiếm theo từ khóa

### **3. Tạo Tin Đăng Bán**
- Click "Bán Xe" hoặc "Đăng Tin Mới"
- Điền thông tin: tên, mô tả, giá, điều kiện
- Upload 1-5 ảnh sản phẩm
- Chọn danh mục & thương hiệu
- Nhấn "Đăng Bán"

### **4. Quản Lý Tin Của Tôi**
- Xem danh sách tin đang bán
- Chỉnh sửa giá, mô tả
- Ẩn / xóa tin
- Xem lịch sử lượt xem

### **5. Mua Xe**
- Tìm xe cần mua
- Xem chi tiết & hình ảnh
- Click "Mua Ngay" hoặc "Chat Người Bán"
- Hoàn tất thanh toán

### **6. Quản Lý Đơn Hàng**
- Xem tất cả đơn mua / bán
- Cập nhật trạng thái: chờ xác nhận → đã gửi → đã nhận
- Đánh giá người bán
- Xem lịch sử giao dịch


---


## 📊 Luật Giao Dịch & Quy Định

### **Đối với Người Bán**
- Mô tả hàng **chính xác, chi tiết**
- Upload ảnh **chất lượng, rõ ràng**
- Giá **hợp lý** so với thị trường
- Phản hồi **nhanh** tin nhắn từ người mua

### **Đối với Người Mua**
- **Xác nhận thanh toán** sau khi nhận hàng
- **Đánh giá công bằng** (5 sao nếu tốt, 1 sao nếu tệ)
- **Báo cáo gian lận** nếu hàng không đúng với mô tả

### **Tranh Chấp**
- Nếu xảy ra tranh chấp, cả 2 bên liên hệ admin
- Admin sẽ xem xét bằng chứng (hình ảnh, tin nhắn)
- Quyết định cuối cùng của admin là chính thức

---

## 👥 Bảng Phân Công Thành Viên

| STT | Họ và Tên | Vai Trò | Phần Việc Chính | File Chính |
|-----|-----------|---------|-----------------|-----------|
| 1 | Huỳnh Nguyễn Tiến Lộc | **BE 1 + BE 2** | Auth + Profile và Bike + Catalog | `authController.js`, `userController.js`, `bikeController.js`, `catalogController.js` |
| 2 | Nguyễn Hoàng Nam | **BE 3** | Orders + Payment | `paymentController.js` |
| 3 | Nguyễn Thụy Thúy Vy | **FE** | UI + JavaScript | `static/js/*.js` |
| 4 | Huỳnh Nguyễn Tiến Lộc + NGuyễn Thụy Thúy Vy | **Check dự án** | Liên kết tất cả module và đảm bảo hệ thống chạy hoàn chỉnh. 

---

## 📝 Ghi Chú Quan Trọng

- **Backend chạy từ**: `backend/src/server.js`
- **Frontend tĩnh**: `static/` (PHP/HTML/CSS/JS)
- **Database schema**: `backend/database/init.sql`
- **Ảnh upload**: `uploads/` (tự động tạo)
- **Docker MySQL**: user `root`, password `123`, database `bike_marketplace`
- **JWT expires**: 24 giờ (có thể chỉnh trong `.env`)
- **Max file size**: 5MB/ảnh (chỉnh MAX_FILE_SIZE_MB)

---

**Dự án được cập nhật**: 2025-05-05  
**Phiên bản**: v1.0  
**Giấy phép**: Xem file `LICENSE`
