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
                                <!-- Form -->
                                <form id="sellForm">
                                    <div class="mb-3">
                                        <label for="title" class="form-label">Tên Sản Phẩm</label>
                                        <input type="text" class="form-control" id="title" placeholder="VD: Giant XTC Pro 29" required>
                                    </div>

                                    <div class="mb-3">
                                        <label for="price" class="form-label">Giá (VNĐ)</label>
                                        <input type="number" class="form-control" id="price" placeholder="VD: 5000000" required>
                                    </div>

                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="category_id" class="form-label">Danh Mục</label>
                                            <select class="form-control" id="category_id" required>
                                                <option value="" disabled selected>-- Chọn danh mục --</option>
                                                <option value="1">Xe leo núi (MTB)</option>
                                                <option value="2">Xe thể thao (Road/Racing)</option>
                                                <option value="3">Xe đạp thông thường (City)</option>
                                                <option value="4">Xe phích (Fixie)</option>
                                            </select>
                                        </div>

                                        <div class="col-md-6 mb-3">
                                            <label for="brand_id" class="form-label">Thương Hiệu</label>
                                            <select class="form-control" id="brand_id" required>
                                                <option value="" disabled selected>-- Chọn thương hiệu --</option>
                                                <option value="1">Trek</option>
                                                <option value="2">Specialized</option>
                                                <option value="3">Cannondale</option>
                                                <option value="4">Cervélo</option>
                                                <option value="5">Giant</option>
                                                <option value="6">Asama</option>
                                                <option value="7">State Bicycle</option>
                                                <option value="8">Quella</option>
                                            </select>
                                        </div>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="frame_size" class="form-label">Kích thước khung</label>
                                            <input type="text" class="form-control" id="frame_size" placeholder="VD: S, M, L...">
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <label for="frame_material" class="form-label">Chất liệu khung</label>
                                            <input type="text" class="form-control" id="frame_material" placeholder="VD: Nhôm, Carbon...">
                                        </div>
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
