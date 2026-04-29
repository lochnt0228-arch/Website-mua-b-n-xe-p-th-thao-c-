# 🚲 Bike Marketplace - Nền Tảng Chợ Mua Bán Xe Đạp Thể Thao (C2C)

Dự án này là nền tảng thương mại điện tử hoạt động theo mô hình **C2C (Consumer-to-Consumer)**. Bất kỳ người dùng nào sau khi đăng nhập và được xác thực lưu trong hệ thống đều có quyền trở thành **Người mua (Buyer)** hoặc **Người bán (Seller)**.

Dự án được thiết kế với kiến trúc Monorepo, đề cao tính toàn vẹn của dữ liệu giao dịch và tính bảo mật định danh người dùng.

---

## 🛠 1. Công Nghệ Sử Dụng (Tech Stack)

### Frontend: HTML5, CSS3, Vanilla JavaScript
* **Ưu điểm:** Nhẹ, không phụ thuộc framework, giúp rèn luyện tư duy xử lý DOM trực tiếp và tương tác API nguyên thủy. Dễ dàng để các thành viên BE đọc hiểu và hỗ trợ chéo.
* **Khuyết điểm:** Đòi hỏi kỷ luật chia file JS nghiêm ngặt để tránh code rối (Spaghetti code).
* **Nguồn tham khảo:** *MDN Web Docs.*

### Backend: Node.js, Express.js v5, MySQL
* **Ưu điểm:** Node.js xử lý I/O không đồng bộ ưu việt. Cơ sở dữ liệu quan hệ MySQL đảm bảo tính ACID, cực kỳ quan trọng để xử lý các giao dịch mua bán, bảo toàn dữ liệu đơn hàng an toàn.
* **Khuyết điểm:** Phải cẩn trọng với các lỗ hổng SQL Injection và bảo mật API. Lưu ý: **Express v5** có một số thay đổi so với v4 (async error handling tự động, thay đổi routing).
* **Nguồn tham khảo:** *Node.js Official Documentation, MySQL 8.0 Reference Manual, Express.js v5 Migration Guide.*

---

## 📂 2. Cấu Trúc Dự Án (Folder Structure)

```text
bike-marketplace/
├── static/                      # Khu vực Client-side (Tài nguyên tĩnh)
│   ├── assets/                  # CSS, JS, Images, Fonts gốc của Template ClassiGrids
│   ├── css/
│   │   └── style.css            # File style tùy chỉnh của nhóm
│   ├── js/
│   │   └── api.js               # [CỐT LÕI] Hàm fetch() trung tâm, tự động đính kèm JWT Token
│   ├── lib/                     # Thư viện bên thứ ba (Third-party)
│   │   ├── css/                 # Chứa các file CSS của Bootstrap
│   │   └── js/                  # Chứa các file JS của Bootstrap
│   ├── index.html               # Trang chủ
│   ├── about-us.html            # Trang giới thiệu
│   ├── pricing.html             # Trang bảng giá
│   └── 404.html                 # Trang lỗi
│
├── backend/                     # Khu vực Server-side
│   ├── database/
│   │   └── init.sql             # File SQL khởi tạo toàn bộ schema CSDL
│   ├── src/                     # Mã nguồn xử lý logic của Server
│   │   ├── server.js            # [Entry Point] Cấu hình Express, đăng ký tất cả Routes
│   │   ├── db.js                # Khởi tạo MySQL Connection Pool (dùng mysql2/promise)
│   │   ├── controllers/         # Xử lý business logic cho từng nhóm tính năng
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── bikeController.js
│   │   │   ├── catalogController.js
│   │   │   └── paymentController.js
│   │   ├── routes/              # Định nghĩa các API Endpoint
│   │   │   ├── authRoutes.js        # /api/auth
│   │   │   ├── userRoutes.js        # /api/users/profile
│   │   │   ├── bikeRoutes.js        # /api/bikes
│   │   │   ├── catalogRoutes.js     # /api (catalog/search)
│   │   │   ├── paymentRoutes.js     # /api/orders
│   │   │   └── confirmRoutes.js     # /api/payments
│   │   └── middleware/
│   │       └── authMiddleware.js    # Xác thực JWT, gắn req.user cho các route bảo mật
│   ├── .env                     # [BẢO MẬT] Không commit - xem hướng dẫn cài đặt bên dưới
│   ├── .env.example             # Mẫu biến môi trường - commit file này lên Git
│   └── package.json             # Quản lý thư viện (Express v5, MySQL2, Bcrypt, JWT, dotenv)
│
├── .gitignore                   # Chặn node_modules, .env và các file rác
├── LICENSE                      # Giấy phép MIT
└── README.md                    # Tài liệu hướng dẫn dự án
```

> ⚠️ **Lưu ý:** File `be3.js` ở thư mục gốc là file **nháp tham khảo** minh hoạ logic Transaction cho BE3, **không phải** file chạy thực tế. Entry point duy nhất của server là `backend/src/server.js`.

---

## ⚙️ 3. Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu cầu hệ thống
* Node.js >= 18.x
* MySQL >= 8.0

### Các bước thực hiện

**Bước 1: Clone repository và cài đặt thư viện**
```bash
git clone <url-repository>
cd bike-marketplace/backend
npm install
```

**Bước 2: Cấu hình biến môi trường**

Sao chép file mẫu và điền thông tin thực tế:
```bash
cp .env.example .env
```

Nội dung file `.env` cần có:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bike_marketplace
JWT_SECRET=your_super_secret_key
PORT=5000
```

**Bước 3: Khởi tạo cơ sở dữ liệu**
```bash
mysql -u root -p < database/init.sql
```

**Bước 4: Khởi động server**
```bash
node src/server.js
```

Truy cập ứng dụng tại: `http://localhost:5000`

---

## 🗄️ 4. Thiết Kế Cơ Sở Dữ Liệu

Tên database: `bike_marketplace`. Schema gồm 3 nhóm bảng chính:

**Nhóm Core (Tài khoản & Danh mục)**
* `users` — Tài khoản người dùng. Cột mật khẩu đặt tên `password_hash` để nhắc bắt buộc phải băm (bcrypt) trước khi lưu. Role: `ADMIN` | `USER`.
* `categories` — Danh mục xe (MTB, Road, City, Fixie).
* `brands` — Thương hiệu (Trek, Specialized, Giant, Asama...).

**Nhóm Catalog (Tin đăng & Tương tác)**
* `bike_posts` — Tin đăng bán xe. Khoá ngoại tới `seller_id`, `category_id`, `brand_id`. Status: `AVAILABLE` | `PENDING` | `SOLD` | `HIDDEN`. Giá dùng `DECIMAL(15,0)` để tránh sai số số thực với VNĐ.
* `wishlists` — Danh sách yêu thích của người mua (composite PK).
* `offers` — Bảng trả giá (counter-offer) giữa buyer và seller.

**Nhóm Business (Giao dịch & Thanh toán)**
* `orders` — Đơn hàng. Liên kết `buyer_id` ↔ `post_id`. Status: `PENDING` | `PAID` | `SHIPPING` | `COMPLETED` | `CANCELLED`.
* `payments` — Thanh toán. Hỗ trợ: `COD` | `VNPAY` | `BANK_TRANSFER`.
* `inspection_reports` — Biên bản kiểm định xe trước giao dịch.
* `reviews` — Đánh giá sau giao dịch (buyer đánh giá seller và ngược lại).

---

## 🔄 5. Quy Trình Làm Việc Git (Cẩm nang nội bộ)

Nhóm thống nhất sử dụng quy trình gộp code trực tiếp (Local Merge). Các thành viên thực hiện nghiêm ngặt theo vòng lặp 5 bước sau:

* **Bước 1: Chuyển sang nhánh cá nhân**
    Trước khi bắt đầu gõ code, hãy chắc chắn bạn đang ở nhánh của riêng mình.
    * Lệnh: `git checkout ten-nhanh-cua-ban` *(Ví dụ: `git checkout TienLoc`)*

* **Bước 2: Lưu lại công việc (Commit)**
    Sau khi hoàn thành tính năng, tiến hành lưu lại code trên nhánh cá nhân.
    * Lệnh 1: `git add .`
    * Lệnh 2: `git commit -m "Nội dung công việc đã làm"`

* **Bước 3: Gộp code vào nhánh chính (Merge)**
    Chuyển về nhánh chính để gộp code.
    * Lệnh 1: `git checkout main`
    * Lệnh 2: `git merge ten-nhanh-cua-ban` *(Ví dụ: `git merge TienLoc`)*

* **Bước 4: Đẩy code lên hệ thống (Push)**
    Sau khi gộp thành công, đẩy toàn bộ code mới nhất lên kho lưu trữ chung.
    * Lệnh: `git push origin main`

* **Bước 5: Lấy code mới nhất về (Pull)**
    **Tuyệt đối ghi nhớ:** Lần làm việc tiếp theo, trước khi code bao giờ cũng phải lấy code mới nhất từ `main` về máy.
    * Lệnh 1: `git checkout main`
    * Lệnh 2: `git pull origin main`

*(Hoàn thành Bước 5, quay lại Bước 1 để làm tính năng mới).*

---

## 👥 6. Phân Công Nhiệm Vụ & Ràng Buộc (Contracts)

Để đảm bảo tính toàn vẹn của mô hình Marketplace C2C, toàn bộ team bắt buộc tuân thủ các quy tắc sau.

### 📑 Quy chuẩn API (Bắt buộc toàn team)

**Mọi phản hồi từ Backend phải đúng định dạng JSON sau:**
```json
// Thành công
{ "success": true, "message": "Thông báo", "data": { } }

// Thất bại
{ "success": false, "message": "Lý do lỗi", "data": null }
```
> ❌ **Không dùng** `{ "error": "..." }` hay bất kỳ định dạng nào khác. Mọi response đều phải có đủ 3 trường `success`, `message`, `data`.

---

### A. Nhóm Backend (3 Thành viên)

**1. BE 1 (Core & Security): Xác thực & Định danh**
* **Files phụ trách:** `controllers/authController.js`, `controllers/userController.js`, `routes/authRoutes.js`, `routes/userRoutes.js`
* **API Endpoints:** `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/users/profile`
* **Ràng buộc bảo mật:**
    * Bắt buộc mã hóa password bằng `bcrypt` trước khi insert vào DB (lưu vào cột `password_hash`).
    * Cấp phát Token qua `jsonwebtoken` (JWT). **Trọng tâm:** Payload của Token bắt buộc chứa `user_id` và `role`.
    * Chống SQL Injection triệt để bằng **Prepared Statements** (dùng dấu `?` trong query).

**2. BE 2 (Marketplace Catalog): Luồng Đăng Bán & Tìm Kiếm**
* **Files phụ trách:** `controllers/bikeController.js`, `controllers/catalogController.js`, `routes/bikeRoutes.js`, `routes/catalogRoutes.js`
* **API Endpoints:** `POST /api/bikes`, `GET /api/bikes`, `PUT /api/bikes/:id`, `DELETE /api/bikes/:id`
* **Ràng buộc (Bảo mật tuyệt đối):**
    * Khi tạo tin đăng (`POST /api/bikes`), **tuyệt đối KHÔNG lấy `seller_id` từ `req.body`**. Middleware phải tự động giải mã JWT Token từ `authMiddleware`, trích xuất `req.user.user_id` và gán làm `seller_id`. (Ngăn chặn hacker mạo danh người bán).
    * Bảng trong DB là **`bike_posts`** (không phải `bikes`). Status hợp lệ: `AVAILABLE`, `PENDING`, `SOLD`, `HIDDEN`.
    * API `GET` danh sách xe bắt buộc có Phân trang (Pagination) qua `LIMIT` và `OFFSET`.

**3. BE 3 (Business Logic): Luồng Mua Hàng & Thanh Toán**
* **Files phụ trách:** `controllers/paymentController.js`, `routes/paymentRoutes.js`, `routes/confirmRoutes.js`
* **API Endpoints:** `POST /api/orders`, `GET /api/orders/my`, `DELETE /api/orders/:id`, `POST /api/payments/:payment_id/confirm`
* **Ràng buộc (Tử huyệt):**
    * Phải lấy `buyer_id` tự động từ `req.user.user_id` (JWT), không từ body.
    * Tham chiếu DB qua `require('../db')` (path tương đối từ `src/`), **không phải** `../../shared/db`.
    * Thao tác đặt hàng bắt buộc dùng **MySQL Transactions** (`beginTransaction`, `COMMIT`, `ROLLBACK`). Việc ghi vào `orders` và cập nhật `bike_posts` phải xảy ra trong cùng một transaction. Nếu một bước lỗi, phải Rollback toàn bộ.
    * Khoá dòng khi kiểm tra tồn kho bằng `SELECT ... FOR UPDATE` để tránh race condition.

---

### B. Nhóm Frontend (2 Thành viên)

**1. FE 1 (Base & User Entity): Kiến trúc nền & Tài khoản**
* **Files phụ trách:** `static/js/api.js` và các file HTML liên quan đến auth
* **Nhiệm vụ:** Thiết lập UI/UX nền tảng và xử lý logic gọi API Auth.
* **Ràng buộc:**
    * Lưu trữ Token vào `localStorage` (hoặc `sessionStorage`).
    * Tự động gắn header `Authorization: Bearer <token>` vào mọi request bảo mật thông qua hàm `fetch()` được cấu hình chung trong `static/js/api.js`.
    * **Bảo vệ Route:** Tự động đá văng người dùng chưa đăng nhập ra khỏi các trang nhạy cảm (Form đăng bán, trang quản lý đơn hàng).

**2. FE 2 (C2C Flow): Trải nghiệm Mua & Bán**
* **Files phụ trách:** `static/index.html`, các trang listing và form đăng tin
* **Nhiệm vụ:** Xây dựng UI/UX cho trang danh sách xe và form đăng tin.
* **Ràng buộc:**
    * UI phải hiển thị rõ ràng trạng thái sở hữu (*"Xe này đang được bán bởi: [Tên User]"*).
    * Thanh tìm kiếm bắt buộc dùng kỹ thuật **Debounce** (delay ~300ms) để chống spam API.
    * Khi bấm các nút gọi API quan trọng ("Đăng bán", "Đặt mua"), trạng thái nút phải lập tức chuyển sang Disabled/Loading. Chặn lỗi bấm đúp (double-click) sinh nhiều request.
