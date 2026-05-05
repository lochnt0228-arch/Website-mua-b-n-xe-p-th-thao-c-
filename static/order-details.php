<?php include 'includes/header.php'; ?>

<main class="py-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h2 class="h5 mb-   ">Thông Tin Đơn Hàng</h2>
                            <span id="order-status-badge" class="badge bg-secondary">Đang tải...</span>
                        </div>

                        <div id="loading-spinner" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <div id="order-content" style="display: none;">
                            <!-- Thông tin người bán -->
                            <div class="mb-4">
                                <h5 class="h6 mb-2 text-muted">Người Bán</h5>
                                <div class="d-flex align-items-center">
                                    <div class="avatar-placeholder me-2 bg-light d-flex align-items-center justify-content-center rounded-circle" style="width: 40px; height: 40px;">
                                        <i class="lni lni-user text-primary"></i>
                                    </div>
                                    <div>
                                        <p class="mb-0 fw-bold" id="seller-name">-</p>
                                        <p class="mb-0 small text-muted" id="seller-email">-</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Địa chỉ giao hàng đã điền -->
                            <div class="mb-4">
                                <h5 class="h6 mb-2">Địa Chỉ Giao Hàng Của Bạn</h5>
                                <div class="alert alert-primary p-3 border rounded" id="shipping-address">
                                    -
                                </div>
                            </div>

                            <!-- Sản phẩm đã mua -->
                            <div class="mb-4">
                                <h5 class="h6 mb-3">Sản Phẩm Đã Mua</h5>
                                <div class="d-flex align-items-center p-3 border rounded shadow-sm">
                                    <img src="" id="bike-img" class="rounded me-3" style="width: 120px; height: 80px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-1" id="bike-title">-</h6>
                                        <p class="mb-0 text-primary fw-bold" id="bike-price">0 VNĐ</p>
                                        <p class="mb-0 small text-muted mt-1">Ngày mua: <span id="order-date">-</span></p>
                                    </div>
                                </div>
                            </div>

                            <hr>

                            <div class="alert alert-warning" id="shipping-note" style="display: none;">
                                <i class="lni lni-warning"></i> Đơn hàng đang được người bán chuẩn bị giao.
                            </div>
                            
                            <div class="text-center">
                                <a href="my-orders.php" class="btn btn-outline-secondary">Quay lại danh sách</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>

<?php include 'includes/footer.php'; ?>

<!-- ========================= JS here ========================= -->
<script src="assets/js/bootstrap.min.js"></script>
<script src="assets/js/wow.min.js"></script>
<script src="assets/js/main.js"></script>
<script src="js/api.js"></script>
<script src="js/auth.js"></script>
<script src="js/auth-navbar.js"></script>
<script src="js/route-guard.js"></script>
<script src="js/order-details.js"></script>
</body>
</html>
