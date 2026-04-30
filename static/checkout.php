<?php include 'includes/header.php'; ?>


    <!-- Start Main Content -->
    <main>
        <section class="py-5 my-5">
            <div class="container">
                <h2 class="mb-4">Thanh Toán</h2>
                <div class="row">
                    <div class="col-lg-8">
                        <!-- Alert -->
                        <div class="alert alert-info">
                            ✅ <strong>Trang này đã được bảo vệ bởi Route Guard!</strong> Chỉ người dùng đã đăng nhập mới có thể thao tác.
                        </div>

                        <!-- Checkout Form -->
                        <div class="card shadow-lg mb-4">
                            <div class="card-body p-4 p-md-5">
                                <h4 class="card-title mb-4">Thông Tin Giao Hàng</h4>
                                <form id="checkoutForm">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="fullName" class="form-label">Họ và Tên</label>
                                            <input type="text" class="form-control" id="fullName" placeholder="Nguyễn Văn A" required>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="phone" class="form-label">Số Điện Thoại</label>
                                            <input type="tel" class="form-control" id="phone" placeholder="0912345678" required>
                                        </div>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <label for="address" class="form-label">Địa Chỉ Nhận Hàng</label>
                                        <input type="text" class="form-control" id="address" placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP" required>
                                    </div>

                                    <div class="mb-3">
                                        <label for="notes" class="form-label">Ghi Chú Đơn Hàng (Tùy chọn)</label>
                                        <textarea class="form-control" id="notes" rows="3" placeholder="Ví dụ: Giao hàng giờ hành chính..."></textarea>
                                    </div>
                                    
                                    <hr class="my-4">
                                    
                                    <h4 class="card-title mb-3">Phương Thức Thanh Toán</h4>
                                    <div class="form-check mb-2 custom-radio p-3 border rounded">
                                        <input class="form-check-input ms-1" type="radio" name="paymentMethod" id="cod" value="cod" checked>
                                        <label class="form-check-label fw-bold ms-2" for="cod">
                                            Thanh toán khi nhận hàng (COD)
                                        </label>
                                        <small class="d-block text-muted ms-4 ps-1 mt-1">Thanh toán bằng tiền mặt khi đơn hàng được giao tới.</small>
                                    </div>
                                    <div class="form-check mb-4 custom-radio p-3 border rounded">
                                        <input class="form-check-input ms-1" type="radio" name="paymentMethod" id="transfer" value="transfer">
                                        <label class="form-check-label fw-bold ms-2" for="transfer">
                                            Chuyển khoản qua Ngân hàng
                                        </label>
                                        <small class="d-block text-muted ms-4 ps-1 mt-1">Thông tin chuyển khoản sẽ được hiển thị sau khi hoàn tất đặt hàng.</small>
                                    </div>
                                    
                                    <button type="submit" class="btn btn-primary w-100 fs-5 py-3" id="btnSubmitOrder">Xác Nhận Đặt Hàng</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-lg-4">
                        <div class="card shadow-lg sticky-top" style="top: 100px;">
                            <div class="card-body p-4">
                                <h4 class="card-title mb-4">Tóm Tắt Đơn Hàng</h4>
                                
                                <!-- Mock Product -->
                                <div class="d-flex align-items-center border-bottom pb-3 mb-3">
                                    <img src="assets/images/items-grid/img1.jpg" alt="Product" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                                    <div class="ms-3 flex-grow-1">
                                        <h6 class="mb-1">Xe Đạp Giant XTC Pro</h6>
                                        <div class="d-flex justify-content-between">
                                            <small class="text-muted">Số lượng: 1</small>
                                            <small class="fw-bold text-dark">5.000.000 ₫</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Tạm tính:</span>
                                    <span class="fw-bold">5.000.000 ₫</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                    <span class="text-muted">Phí vận chuyển:</span>
                                    <span class="text-success fw-bold">Miễn phí</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center fw-bold text-primary">
                                    <span class="fs-5">Tổng cộng:</span>
                                    <span class="fs-4">5.000.000 ₫</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <?php include 'includes/footer.php'; ?>


    <!-- ========================= Scripts ========================= -->
    <script src="lib/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/route-guard.js"></script>
    <script src="js/auth-navbar.js"></script>
    <script src="js/checkout.js"></script>
</body>

</html>
