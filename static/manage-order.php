<?php include 'includes/header.php'; ?>

<main class="py-5">
    <div class="container">
        <div class="row">
            <div class="col-lg-8 mx-auto">
                <div class="card shadow-sm border-0">
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                            <h2 class="h5 mb-0">Thông Tin Giao Hàng</h2>
                            <span id="order-status-badge" class="badge bg-secondary">Đang tải...</span>
                        </div>

                        <div id="loading-spinner" class="text-center py-5">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <div id="order-content" style="display: none;">
                            <!-- Thông tin người mua -->
                            <div class="alert alert-info mb-4">
                                <h5 class="h6 mb-2"><i class="lni lni-user"></i> Thông Tin Người Mua</h5>
                                <p class="mb-1"><strong>Email:</strong> <span id="buyer-email">-</span></p>
                                <div id="shipping-address" class="mt-2 pt-2 border-top">
                                    Đang tải thông tin địa chỉ...
                                </div>
                            </div>

                            <!-- Sản phẩm -->
                            <div class="mb-4">
                                <h5 class="h6 mb-3"><i class="lni lni-cart"></i> Sản Phẩm Giao Dịch</h5>
                                <div class="d-flex align-items-center p-3 border rounded">
                                    <img src="" id="bike-img" class="rounded me-3" style="width: 100px; height: 70px; object-fit: cover;">
                                    <div>
                                        <h6 class="mb-1" id="bike-title">-</h6>
                                        <p class="mb-0 text-primary fw-bold" id="bike-price">0 VNĐ</p>
                                    </div>
                                </div>
                            </div>

                            <hr>

                            <!-- Hành động -->
                            <div class="d-flex gap-2" id="order-actions">
                                <button class="btn btn-primary" id="btn-ship-order" style="display: none;">Xác Nhận Giao Hàng</button>
                                <button class="btn btn-success" id="btn-complete-order" style="display: none;">Xác Nhận Hoàn Tất</button>
                                <button class="btn btn-outline-danger" id="btn-cancel-order" style="display: none;">Hủy Đơn</button>
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
<script src="js/manage-order.js"></script>
</body>
</html>
