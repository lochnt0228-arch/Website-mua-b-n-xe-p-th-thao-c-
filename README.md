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
├── static/                   # Khu vực Client-side (Tài nguyên tĩnh)
│   ├── assets/               # CSS, JS, Images, Fonts gốc của Template ClassiGrids
│   ├── css/                  # Chứa file style.css tùy chỉnh của nhóm
│   ├── js/                   # Logic JS do nhóm tự viết
│   │   ├── api.js            # [CỐT LÕI] Hàm fetch() trung tâm, tự động đính kèm JWT Token
│   │   ├── auth.js           # Logic Đăng nhập, Đăng ký, Quản lý phiên
│   │   └── ...               # Các file logic nghiệp vụ khác
│   ├── lib/                  # [THÊM MỚI] Thư viện bên thứ ba (Third-party)
│   │   ├── css/              # Chứa các file CSS của Bootstrap
│   │   └── js/               # Chứa các file JS của Bootstrap
│   ├── index.html            # Trang chủ (Template)
│   ├── 404.html              # Trang lỗi (Template)
│   └── ...                   # Các file HTML khác của template
│
├── backend/                  # Khu vực Server-side
│   ├── database/             # Chứa file thiết kế CSDL
│   │   └── init.sql          # File SQL chuẩn hóa mô hình C2C
│   ├── src/                  # Mã nguồn xử lý logic của Server
│   │   └── server.js         # Entry point (Cấu hình express.static phục vụ thư mục static)
│   ├── .env                  # [BẢO MẬT] Chứa các biến môi trường nhạy cảm
│   ├── package.json          # Quản lý thư viện (Express, MySQL2, Bcrypt, JWT,...)
│   └── node_modules/         # Thư viện cài đặt (Đã được chặn bởi .gitignore)
│
├── .gitignore                # Chặn các file rác và file nhạy cảm lên GitHub
├── LICENSE                   # Giấy phép MIT
└── README.md                 # Tài liệu hướng dẫn dự án

```
## 🔄 3. Quy Trình Làm Việc Git (Cẩm nang nội bộ)

Để đảm bảo tiến độ, nhóm thống nhất sử dụng quy trình gộp code trực tiếp (Local Merge). Các thành viên thực hiện nghiêm ngặt theo vòng lặp 5 bước sau đây:

* **Bước 1: Chuyển sang nhánh cá nhân**
    Trước khi bắt đầu gõ code, hãy chắc chắn bạn đang ở nhánh của riêng mình.
    * Lệnh: `git checkout ten-nhanh-cua-ban` *(Ví dụ: `git checkout TienLoc`)*

* **Bước 2: Lưu lại công việc (Commit)**
    Sau khi hoàn thành tính năng, tiến hành lưu lại code trên nhánh cá nhân.
    * Lệnh 1: `git add .`
    * Lệnh 2: `git commit -m "Nội dung công việc đã làm"`

* **Bước 3: Gộp code vào nhánh chính (Merge)**
    Hệ thống đã ghi nhận code trên nhánh cá nhân. Tiếp theo, chuyển về nhánh chính để gộp code.
    * Lệnh 1: `git checkout main`
    * Lệnh 2: `git merge ten-nhanh-cua-ban` *(Ví dụ: `git merge TienLoc`)*

* **Bước 4: Đẩy code lên hệ thống (Push)**
    Sau khi gộp thành công, đẩy toàn bộ code mới nhất từ máy bạn lên kho lưu trữ chung.
    * Lệnh: `git push origin main`

* **Bước 5: Lấy code mới nhất về (Pull)**
    **Tuyệt đối ghi nhớ:** Lần làm việc tiếp theo, trước khi code bao giờ cũng phải lấy code mới nhất từ nhánh `main` về máy để tránh bị đè code của người khác.
    * Lệnh 1: `git checkout main`
    * Lệnh 2: `git pull origin main`

*(Hoàn thành Bước 5, quay lại Bước 1 để làm tính năng mới).*
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
