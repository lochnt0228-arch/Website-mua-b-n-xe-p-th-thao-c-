# 🚲 Bike Marketplace - Nền Tảng Chợ Mua Bán Xe Đạp Thể Thao (C2C)

Dự án này là nền tảng thương mại điện tử hoạt động theo mô hình **C2C (Consumer-to-Consumer)**. Bất kỳ người dùng nào sau khi đăng nhập và được xác thực lưu trong hệ thống đều có quyền trở thành **Người mua (Buyer)** hoặc **Người bán (Seller)**.

Dự án được thiết kế với kiến trúc Monorepo, đề cao tính toàn vẹn của dữ liệu giao dịch và tính bảo mật định danh người dùng.

---

## 🛠 1. Công Nghệ Sử Dụng (Tech Stack)

### Frontend: HTML5, CSS3, Vanilla JavaScript
* **Ưu điểm:** Nhẹ, không phụ thuộc framework, giúp rèn luyện tư duy xử lý DOM trực tiếp và tương tác API nguyên thủy. Dễ dàng để các thành viên BE đọc hiểu và hỗ trợ chéo.
* **Khuyết điểm:** Đòi hỏi kỷ luật chia file JS nghiêm ngặt để tránh code rối (Spaghetti code).
* **Nguồn tham khảo:** *MDN Web Docs.*

### Backend: Node.js, Express.js, MySQL
* **Ưu điểm:** Node.js xử lý I/O không đồng bộ ưu việt. Cơ sở dữ liệu quan hệ MySQL đảm bảo tính ACID, cực kỳ quan trọng để xử lý các giao dịch mua bán, trừ số lượng kho an toàn.
* **Khuyết điểm:** Phải cẩn trọng với các lỗ hổng SQL Injection và bảo mật API.
* **Nguồn tham khảo:** *Node.js Official Documentation, MySQL 8.0 Reference Manual.*

---

## 📂 2. Cấu Trúc Dự Án (Folder Structure)

```text
bike-marketplace/
├── frontend/                 # Khu vực Client-side
│   ├── assets/               # Hình ảnh, icon, font
│   ├── css/                  # style.css chung
│   ├── js/                   # Logic JS chia theo Domain
│   │   ├── api.js            # [CỐT LÕI] Hàm fetch() trung tâm, tự động đính kèm JWT Token
│   │   ├── auth.js           # Đăng nhập, Đăng ký, Quản lý phiên
│   │   ├── marketplace.js    # Hiển thị lưới xe, Tìm kiếm, Lọc
│   │   ├── seller.js         # Logic Đăng bán xe, Quản lý tin đăng
│   │   └── buyer.js          # Giỏ hàng, Thanh toán, Lịch sử mua
│   └── pages/                # index.html, login.html, sell-bike.html,...
│
├── backend/                  # Khu vực Server-side
│   ├── src/
│   │   ├── config/           # Cấu hình MySQL (mysql2)
│   │   ├── controllers/      # Xử lý Request/Response
│   │   ├── middlewares/      # [CỐT LÕI] authMiddleware.js (Giải mã JWT, trích xuất user_id)
│   │   ├── routes/           # Định tuyến (/api/v1/auth, /api/v1/bikes, /api/v1/orders)
│   │   ├── utils/            # Hash password, format dữ liệu
│   │   └── server.js         # Entry point
│   ├── .env                  # [BẢO MẬT] Chứa DB_PASS, JWT_SECRET (KHÔNG PUSH LÊN GIT)
│   └── package.json
│
├── .gitignore                # Chặn node_modules và .env
├── LICENSE                   # Giấy phép MIT
└── README.md                 # Tài liệu dự án

```
## 🔄 3. Quy Trình Làm Việc Git (Bắt Buộc)

Nhánh `main` là nhánh sản phẩm cuối cùng. **Tuyệt đối không một ai được quyền `push` trực tiếp lên nhánh `main`.**

* **1. Cập nhật:** Trước khi code, luôn đồng bộ hóa dự án.
    * `git checkout main`
    * `git pull origin main`
* **2. Nhánh tính năng:** Mọi tính năng phải được phát triển trên nhánh riêng biệt.
    * `git checkout -b feature/ten-chuc-nang` *(VD: `feature/api-tao-don-hang`)*
* **3. Commit:** Lưu lịch sử với thông điệp rõ ràng, có tiền tố phân loại.
    * `git add .`
    * `git commit -m "feat: Nội dung công việc rõ ràng"`
* **4. Push:** Đẩy nhánh cá nhân lên kho lưu trữ từ xa.
    * `git push origin feature/ten-chuc-nang`
* **5. Merge:** Truy cập Github để tạo **Pull Request (PR)**.
    * *Quy tắc thép:* Chỉ Nhóm trưởng mới có quyền Review (đọc kiểm tra code) và bấm Merge. Nếu xảy ra conflict, người làm tính năng đó phải tự resolve dưới máy local trước khi PR được duyệt.

---

## 👥 4. Phân Công Nhiệm Vụ & Ràng Buộc (Contracts)

Để đảm bảo tính toàn vẹn của mô hình Marketplace C2C, toàn bộ team bắt buộc tuân thủ các quy tắc sau. 
**Định dạng phản hồi chung cho mọi API Backend:** `{ "success": boolean, "message": string, "data": any }`.

### A. Nhóm Backend (3 Thành viên)

**1. BE 1 (Core & Security): Xác thực & Định danh**
* **Nhiệm vụ:** Xây dựng API Đăng ký, Đăng nhập, Quản lý Profile.
* **Ràng buộc bảo mật:**
    * Bắt buộc mã hóa password bằng thư viện `bcrypt` trước khi insert vào DB.
    * Cấp phát Token qua `jsonwebtoken` (JWT). **Trọng tâm:** Bên trong Payload của Token bắt buộc phải chứa `user_id` để làm bằng chứng định danh cho mọi thao tác mua bán phía sau.
    * Chống SQL Injection triệt để bằng cách sử dụng **Prepared Statements** (dùng dấu `?` trong các câu query).

**2. BE 2 (Marketplace Catalog): Luồng Đăng Bán & Tìm Kiếm**
* **Nhiệm vụ:** Viết API Đăng bán xe (Tạo tin), Hiển thị danh sách xe, Sửa/Xóa tin đăng.
* **Ràng buộc (Bảo mật tuyệt đối):**
    * Khi nhận Request tạo tin đăng (`POST /api/bikes`), **tuyệt đối KHÔNG lấy `seller_id` từ `req.body` do FE gửi lên**. Middleware phải tự động giải mã JWT Token, trích xuất `user_id` của phiên làm việc hiện tại và gán vào DB làm `seller_id`. (Ngăn chặn hacker thay đổi body để mạo danh người khác đăng bài).
    * API `GET` danh sách xe bắt buộc phải có tính năng Phân trang (Pagination) thông qua `LIMIT` và `OFFSET`.

**3. BE 3 (Business Logic): Luồng Mua Hàng & Thanh Toán**
* **Nhiệm vụ:** Xử lý logic Tạo đơn hàng (`Orders`) và trừ số lượng trong kho (`Bikes`).
* **Ràng buộc (Tử huyệt):**
    * Tương tự BE2, phải lấy `buyer_id` tự động từ JWT Token.
    * Thao tác thanh toán bắt buộc dùng **MySQL Transactions** (`BEGIN`, `COMMIT`, `ROLLBACK`). Việc ghi dữ liệu vào bảng Orders và Update bảng Bikes phải xảy ra trong cùng một phiên. Nếu 1 trong 2 quá trình sinh lỗi, phải Rollback toàn bộ để chặn đứng tình trạng "bán khống" hoặc mất mát dữ liệu.

### B. Nhóm Frontend (2 Thành viên)

**1. FE 1 (Base & User Entity): Kiến trúc nền & Tài khoản**
* **Nhiệm vụ:** Thiết lập UI/UX nền tảng và Xử lý logic gọi API Auth.
* **Ràng buộc:**
    * Lưu trữ Token an toàn vào `localStorage` (hoặc `sessionStorage`).
    * Tự động gắn header `Authorization: Bearer <token>` vào mọi request có yêu cầu bảo mật thông qua một hàm `fetch()` được cấu hình chung trong file `api.js`.
    * **Bảo vệ Route:** Xây dựng cơ chế bắt luồng, tự động đá văng người dùng chưa đăng nhập ra khỏi các trang nhạy cảm như Form Đăng bán (`/sell.html`) hay Giỏ hàng (`/cart.html`).

**2. FE 2 (C2C Flow): Trải nghiệm Mua & Bán**
* **Nhiệm vụ:** Xây dựng UI/UX cho Trang chủ (Lưới xe đạp) và Form đăng tin.
* **Ràng buộc:**
    * UI phải hiển thị rạch ròi trạng thái sở hữu (Ví dụ: *"Xe này đang được bán bởi: [Tên User]"*).
    * Thanh tìm kiếm bắt buộc gắn kỹ thuật **Debounce** (delay ~300ms) để chống spam API khi người dùng gõ liên tục.
    * Khi bấm các nút gọi API quan trọng ("Đăng bán", "Đặt mua"), trạng thái nút phải lập tức chuyển sang Disabled hoặc Loading. Tuyệt đối chặn lỗi người dùng bấm đúp (double-click) sinh ra nhiều request rác trên Server.
