-- 1. Khởi tạo Database và sử dụng
CREATE DATABASE IF NOT EXISTS bike_marketplace;
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
USE bike_marketplace;

-- Thêm dữ liệu mẫu cho bảng categories (Danh mục)
INSERT INTO categories (name) VALUES 
('Xe đạp leo núi (MTB)'), 
('Xe đạp đua (Road)'), 
('Xe đạp đường phố (City)'),
('Xe đạp trẻ em');

-- Thêm dữ liệu mẫu cho bảng brands (Thương hiệu)
INSERT INTO brands (name) VALUES 
('Giant'), 
('Trek'), 
('Asama'),
('Trinx');