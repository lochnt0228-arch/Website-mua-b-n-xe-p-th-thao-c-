<?php include 'includes/header.php'; ?>


    <!-- Start Main Content -->
    <main>
        <!-- Start Profile Section -->
        <section class="py-5 my-5">
            <div class="container">
                <div class="row">
                    <div class="col-lg-8 mx-auto">
                        <div class="card shadow-lg">
                            <div class="card-body p-5">
                                <h2 class="card-title mb-4">Hồ Sơ Cá Nhân</h2>

                                <!-- Alert Messages -->
                                <div id="alert-container"></div>

                                <!-- Loading Skeleton -->
                                <div id="loading-skeleton">
                                    <div class="placeholder-glow">
                                        <span class="placeholder col-12 mb-3"></span>
                                        <span class="placeholder col-12 mb-3"></span>
                                        <span class="placeholder col-12 mb-3"></span>
                                    </div>
                                </div>

                                <!-- Profile Content -->
                                <div id="profile-content" style="display: none;">
                                    <div class="row mb-4">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label text-muted">Họ Tên</label>
                                                <p id="user-full-name" class="fw-bold fs-5">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label text-muted">ID Người Dùng</label>
                                                <p id="user-id" class="fw-bold fs-5">-</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="row mb-4">
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label text-muted">Email</label>
                                                <p id="user-email" class="fw-bold fs-5">-</p>
                                            </div>
                                        </div>
                                        <div class="col-md-6">
                                            <div class="mb-3">
                                                <label class="form-label text-muted">Ngày Tạo</label>
                                                <p id="user-created-at" class="fw-bold fs-5">-</p>
                                            </div>
                                        </div>
                                    </div>

                                    <hr>

                                    <div class="d-flex gap-2">
                                        <button id="refresh-btn" class="btn btn-secondary">
                                            <i class="lni lni-reload"></i> Làm Mới
                                        </button>
                                        <button id="edit-btn" class="btn btn-primary">
                                            <i class="lni lni-pencil"></i> Chỉnh Sửa (Sắp Có)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- User Stats Card -->
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <h5 class="card-title">Tin Đăng</h5>
                                        <p class="fs-3 fw-bold text-primary" id="ads-count">0</p>
                                        <a href="my-ads.php" class="btn btn-sm btn-primary">Xem Chi Tiết</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card text-center">
                                    <div class="card-body">
                                        <h5 class="card-title">Đơn Mua</h5>
                                        <p class="fs-3 fw-bold text-success" id="orders-count">0</p>
                                        <a href="my-orders.php" class="btn btn-sm btn-success">Xem Chi Tiết</a>
                                    </div>
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
    <script src="js/profile.js"></script>
</body>

</html>
