<?php include 'includes/header.php'; ?>


    <!-- Start Main Content -->
    <main>
        <!-- Start Cart Section -->
        <section class="py-5 my-5">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8">
                        <h2 class="mb-4">Giỏ Hàng</h2>

                        <!-- Alert -->
                        <div class="alert alert-info">
                            ✅ <strong>Trang này đã được bảo vệ bởi Route Guard!</strong> Chỉ người dùng đã đăng nhập mới có thể truy cập.
                        </div>

                        <!-- Empty Cart Message -->
                        <div class="card shadow-lg">
                            <div class="card-body p-5 text-center">
                                <i class="lni lni-shopping-cart" style="font-size: 3rem; color: #ccc;"></i>
                                <h4 class="mt-3">Giỏ Hàng Trống</h4>
                                <p class="text-muted">Chưa có sản phẩm nào trong giỏ hàng của bạn.</p>
                                <a href="index.php" class="btn btn-primary">Tiếp Tục Mua Sắm</a>
                            </div>
                        </div>
                    </div>

                    <!-- Cart Summary -->
                    <div class="col-lg-4">
                        <div class="card shadow-lg">
                            <div class="card-body p-4">
                                <h4 class="card-title mb-3">Tóm Tắt Đơn Hàng</h4>
                                
                                <div class="d-flex justify-content-between mb-2">
                                    <span>Tạm tính:</span>
                                    <span>0 ₫</span>
                                </div>
                                <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                                    <span>Phí vận chuyển:</span>
                                    <span>0 ₫</span>
                                </div>
                                <div class="d-flex justify-content-between fw-bold fs-5">
                                    <span>Tổng cộng:</span>
                                    <span>0 ₫</span>
                                </div>

                                <a href="checkout.php" class="btn btn-primary w-100 mt-3 fs-5 py-2">Tiến Hành Thanh Toán</a>
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
</body>

</html>
