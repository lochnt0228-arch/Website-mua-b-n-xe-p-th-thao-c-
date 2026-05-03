-- 1. Khởi tạo Database và sử dụng
SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS bike_marketplace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bike_marketplace;

-- 2. Dọn dẹp an toàn (Tắt kiểm tra khóa ngoại trước khi xóa bảng)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews, payments, inspection_reports, orders, wishlists, offers, bike_posts, brands, categories, users;
SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- PHẦN 1: TÀI KHOẢN VÀ DANH MỤC (CORE)
-- ==========================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Đổi tên để nhắc BE nhớ phải băm mật khẩu
    role ENUM('ADMIN', 'USER') DEFAULT 'USER', -- Chặn dữ liệu rác
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE brands (
    brand_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- ==========================================
-- PHẦN 2: SẢN PHẨM & TƯƠNG TÁC (CATALOG)
-- ==========================================

CREATE TABLE bike_posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(15, 0) NOT NULL, -- Tuyệt đối không dùng FLOAT. Dùng DECIMAL cho VNĐ.
    category_id INT NOT NULL,
    brand_id INT NOT NULL,
    status ENUM('AVAILABLE', 'PENDING', 'SOLD', 'HIDDEN') DEFAULT 'AVAILABLE',
    frame_size VARCHAR(10),
    frame_material VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE RESTRICT,
    FOREIGN KEY (brand_id) REFERENCES brands(brand_id) ON DELETE RESTRICT
);

CREATE TABLE wishlists (
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES bike_posts(post_id) ON DELETE CASCADE
);

CREATE TABLE offers (
    offer_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    buyer_id INT NOT NULL,
    offered_price DECIMAL(15, 0) NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES bike_posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ==========================================
-- PHẦN 3: GIAO DỊCH & THANH TOÁN (BUSINESS)
-- ==========================================

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    post_id INT NOT NULL,
    price DECIMAL(15, 0) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_fee DECIMAL(15, 0) DEFAULT 0,
    status ENUM('PENDING', 'PAID', 'SHIPPING', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (post_id) REFERENCES bike_posts(post_id) ON DELETE RESTRICT
);

CREATE TABLE inspection_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    inspector_id INT NOT NULL,
    condition_rating INT CHECK (condition_rating BETWEEN 1 AND 5),
    inspection_notes TEXT,
    result ENUM('PASSED', 'FAILED', 'NEEDS_REPAIR') NOT NULL,
    inspection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (inspector_id) REFERENCES users(user_id) ON DELETE RESTRICT
);

CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method ENUM('COD', 'VNPAY', 'BANK_TRANSFER') NOT NULL,
    transaction_code VARCHAR(100) UNIQUE,
    amount DECIMAL(15, 0) NOT NULL,
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    paid_at TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT
);

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    reviewed_user_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- categories and brands
INSERT INTO categories (name) VALUES
('Xe leo núi (MTB)'),
('Xe thể thao (Road/Racing)'),
('Xe đạp thông thường (City)'),
('Xe phích (Fixie)');

INSERT INTO brands (name) VALUES
-- Xe leo núi: chuyên địa hình, khung chắc
('Trek'),          -- MTB
('Specialized'),   -- MTB

-- Xe thể thao: nhẹ, khí động học
('Cannondale'),    -- Road
('Cervélo'),       -- Road

-- Xe thông thường: đi phố, bền, giá bình dân
('Giant'),         -- City
('Asama'),         -- City (thương hiệu Việt phổ biến)

-- Xe phích (Fixie): không líp, urban style
('State Bicycle'), -- Fixie
('Quella');        -- Fixie

-- Bổ sung Dữ liệu giả (Dummy Data)
INSERT INTO users (name, email, password_hash, role) VALUES
('Người Bán Pro', 'seller@test.com', '$2a$10$j0x956XhHw6X7T9i2HhS5.a51R2.N2oQh/Vp1uJ9K1H3GfR8YmY3i', 'USER');

INSERT INTO bike_posts (seller_id, title, description, price, category_id, brand_id, status, frame_size, frame_material) VALUES
(1, 'Xe Đạp Địa Hình Giant XTC', 'Xe còn rất mới, chạy êm, phuộc nhún tốt, phù hợp leo núi.', 12500000, 1, 5, 'AVAILABLE', 'M', 'Hợp kim nhôm'),
(1, 'Xe Đạp Đua Trek Emonda Cao Cấp', 'Khung carbon siêu nhẹ, lướt gió nhanh. Đã bảo dưỡng toàn bộ.', 28000000, 2, 1, 'AVAILABLE', 'L', 'Carbon'),
(1, 'Xe Đạp Phố Asama Bền Bỉ', 'Thích hợp đi làm, đi học. Kèm sẵn giỏ xe và baga chắc chắn.', 3500000, 3, 6, 'AVAILABLE', 'S', 'Thép');