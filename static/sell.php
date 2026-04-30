<?php include 'includes/header.php'; ?>


    <!-- Start Main Content -->
    <main>
        <!-- Start Sell Section -->
        <section class="py-5 my-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-8">
                        <div class="card shadow-lg">
                            <div class="card-body p-5">
                                <h2 class="card-title mb-4">Đăng Bán Xe Đạp Của Bạn</h2>

                                <!-- Alert -->
                                <div class="alert alert-info">
                                    ✅ <strong>Trang này đã được bảo vệ bởi Route Guard!</strong> Chỉ người dùng đã đăng nhập mới có thể truy cập.
                                </div>

                                <!-- Form Placeholder -->
                                <form id="sellForm">
                                    <div class="mb-3">
                                        <label for="title" class="form-label">Tên Sản Phẩm</label>
                                        <input type="text" class="form-control" id="title" placeholder="VD: Giant XTC Pro 29">
                                    </div>

                                    <div class="mb-3">
                                        <label for="price" class="form-label">Giá (VNĐ)</label>
                                        <input type="number" class="form-control" id="price" placeholder="VD: 5000000">
                                    </div>

                                    <div class="mb-3">
                                        <label for="category" class="form-label">Danh Mục</label>
                                        <select class="form-control" id="category">
                                            <option>-- Chọn danh mục --</option>
                                            <option>Mountain Bike</option>
                                            <option>Road Bike</option>
                                            <option>Hybrid Bike</option>
                                        </select>
                                    </div>

                                    <div class="mb-3">
                                        <label for="description" class="form-label">Mô Tả</label>
                                        <textarea class="form-control" id="description" rows="5" placeholder="Mô tả chi tiết sản phẩm..."></textarea>
                                    </div>

                                    <button type="submit" class="btn btn-primary w-100" id="btnSubmitSell">Đăng Bán</button>
                                </form>
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
    <script src="js/sell.js"></script>
</body>

</html>
