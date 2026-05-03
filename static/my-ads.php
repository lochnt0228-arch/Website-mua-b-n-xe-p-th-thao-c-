<?php include 'includes/header.php'; ?>

    <main>
        <section class="py-5 my-5">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="card shadow-lg">
                            <div class="card-body p-4">
                                <h3 class="card-title mb-4">Tin Đăng Của Tôi</h3>
                                
                                <div class="alert alert-info">
                                    ✅ Đây là các sản phẩm bạn đã đăng bán trên hệ thống.
                                </div>

                                <div class="table-responsive">
                                    <table class="table table-hover align-middle">
                                        <thead class="table-light">
                                            <tr>
                                                <th>Mã Tin</th>
                                                <th>Hình Ảnh</th>
                                                <th>Tên Sản Phẩm</th>
                                                <th>Giá Bán</th>
                                                <th>Trạng Thái</th>
                                                <th>Ngày Đăng</th>
                                                <th>Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody id="my-ads-list">
                                            <tr>
                                                <td colspan="7" class="text-center">Đang tải dữ liệu...</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <?php include 'includes/footer.php'; ?>

    <!-- Scripts -->
    <script src="lib/js/bootstrap.bundle.min.js"></script>
    <script src="assets/js/main.js"></script>
    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/route-guard.js"></script>
    <script src="js/auth-navbar.js"></script>
    <script src="js/my-ads.js"></script>
</body>
</html>
