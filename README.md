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
🔄 3. Quy Trình Làm Việc Git (Bắt Buộc)
Nhánh main là nhánh sản phẩm cuối cùng. Tuyệt đối không ai được push trực tiếp lên main.

Cập nhật: git checkout main -> git pull origin main.

Nhánh tính năng: git checkout -b feature/ten-chuc-nang (VD: feature/api-tao-don-hang).

Commit: git add . -> git commit -m "feat: Nội dung rõ ràng".

Push: git push origin feature/ten-chuc-nang.

Merge: Tạo Pull Request (PR) trên Github. Chỉ Nhóm trưởng được quyền Review và Merge code.

👥 4. Phân Công Nhiệm Vụ & Ràng Buộc (Contracts)
Để đảm bảo tính toàn vẹn của mô hình C2C, các thành viên bắt buộc tuân thủ các quy tắc sau. Định dạng API BE luôn phải là: { success: boolean, message: string, data: any }.

A. Nhóm Backend (3 Thành viên)
1. BE 1 (Core & Security): Xác thực & Định danh

Nhiệm vụ: API Đăng ký, Đăng nhập, Quản lý Profile.

Ràng buộc:

Mã hóa password bằng bcrypt.

Cấp phát jsonwebtoken (JWT). Trọng tâm: Token phải chứa user_id bên trong payload để làm bằng chứng định danh cho các thao tác Mua/Bán phía sau.

Chống SQL Injection bằng Prepared Statements.

2. BE 2 (Marketplace Catalog): Luồng Đăng Bán & Tìm Kiếm

Nhiệm vụ: API Đăng bán xe (Tạo tin), Hiển thị danh sách xe, Sửa/Xóa tin đăng.

Ràng buộc (Bảo mật tuyệt đối):

Khi nhận Request tạo tin đăng (POST /api/bikes), Tuyệt đối KHÔNG lấy seller_id từ body do FE gửi lên. Middleware phải tự động dịch JWT Token lấy user_id của người đang đăng nhập và gán vào DB làm seller_id. (Tránh lỗi mạo danh).

API GET danh sách xe phải có tính năng Phân trang (Pagination).

3. BE 3 (Business Logic): Luồng Mua Hàng & Thanh Toán

Nhiệm vụ: Tạo đơn hàng (Orders), trừ số lượng kho.

Ràng buộc (Tử huyệt):

Ghi nhận buyer_id tự động từ JWT Token.

Bắt buộc dùng MySQL Transactions (BEGIN, COMMIT, ROLLBACK) khi thao tác bảng Orders và Bikes cùng lúc để không xảy ra tình trạng "bán khống" hoặc mất dữ liệu giữa chừng.

B. Nhóm Frontend (2 Thành viên)
1. FE 1 (Base & User Entity): Kiến trúc nền & Tài khoản

Nhiệm vụ: Thiết lập UI chung. Xử lý luồng Auth.

Ràng buộc:

Quản lý Token trong localStorage. Tự động gắn header Authorization: Bearer <token> vào mọi request qua file api.js.

Bảo vệ Route: Xử lý đẩy người dùng chưa đăng nhập văng khỏi các trang yêu cầu quyền như Đăng bán (/sell.html) hay Giỏ hàng (/cart.html).

2. FE 2 (C2C Flow): Trải nghiệm Mua & Bán

Nhiệm vụ: Xây dựng luồng giao diện: Trang chủ (Mua) và Form đăng tin (Bán).

Ràng buộc:

UI phải tách bạch rõ ràng thông tin: "Xe này được bán bởi User A".

API Tìm kiếm bắt buộc dùng kỹ thuật Debounce (chờ 300ms) chống spam server.

Nút "Đăng bán" hoặc "Đặt mua" phải bị vô hiệu hóa (Disabled/Loading) trong quá trình chờ Server phản hồi để chặn lỗi double-click sinh ra dữ liệu rác.
