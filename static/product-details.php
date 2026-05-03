<?php include 'includes/header.php'; ?>

    <!-- Start Breadcrumbs -->
    <div class="breadcrumbs">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 col-md-6 col-12">
                    <div class="breadcrumbs-content">
                        <h1 class="page-title">Chi Tiết Sản Phẩm</h1>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-12">
                    <ul class="breadcrumb-nav">
                        <li><a href="index.php">Trang Chủ</a></li>
                        <li><a href="javascript:void(0)" id="bc-category">Danh mục</a></li>
                        <li>Chi Tiết Sản Phẩm</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- End Breadcrumbs -->

    <!-- Start Item Details -->
    <section class="item-details section">
        <div class="container">
            <div class="top-area">
                <div class="row">
                    <div class="col-lg-6 col-md-12 col-12">
                        <div class="product-images">
                            <main id="gallery">
                                <div class="main-img">
                                    <img src="https://via.placeholder.com/1000x670?text=Hình+ảnh+xe" id="current" alt="Hình ảnh sản phẩm">
                                </div>
                            </main>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-12 col-12">
                        <div class="product-info">
                            <h2 class="title" id="pd-title">Đang tải...</h2>
                            <p class="location"><i class="lni lni-map-marker"></i><span id="pd-location">Cập nhật sau</span></p>
                            <h3 class="price" id="pd-price">0 VNĐ</h3>
                            <div class="list-info">
                                <h4>Thông tin cơ bản</h4>
                                <ul>
                                    <li><span>Thương hiệu:</span> <span id="pd-brand">Đang tải...</span></li>
                                    <li><span>Danh mục:</span> <span id="pd-category">Đang tải...</span></li>
                                    <li><span>Trạng thái:</span> <span id="pd-status">Đang tải...</span></li>
                                    <li><span>Ngày đăng:</span> <span id="pd-created-at">Đang tải...</span></li>
                                </ul>
                            </div>
                            <div class="contact-info" id="pd-action-box">
                                <ul>
                                    <li>
                                        <a id="btn-buy-now" href="javascript:void(0)" class="btn btn-primary w-100" style="display: none;">
                                            <i class="lni lni-cart-full"></i> Mua Ngay
                                        </a>
                                    </li>
                                </ul>
                                <p class="text-danger mt-2" id="msg-own-product" style="display: none;">Bạn không thể mua sản phẩm do chính mình đăng bán.</p>
                                <p class="text-danger mt-2" id="msg-sold" style="display: none;">Sản phẩm này hiện không còn giao dịch được.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="item-details-blocks">
                <div class="row">
                    <div class="col-lg-8 col-md-7 col-12">
                        <!-- Start Single Block -->
                        <div class="single-block description">
                            <h3>Mô tả chi tiết</h3>
                            <p id="pd-description">Đang tải mô tả sản phẩm...</p>
                        </div>
                        <!-- End Single Block -->
                        <!-- Start Single Block -->
                        <div class="single-block tags">
                            <h3>Thông số kỹ thuật</h3>
                            <ul>
                                <li>Kích thước khung: <span id="pd-frame-size">Đang tải...</span></li>
                                <li>Chất liệu khung: <span id="pd-frame-material">Đang tải...</span></li>
                            </ul>
                        </div>
                        <!-- End Single Block -->
                    </div>
                    <div class="col-lg-4 col-md-5 col-12">
                        <div class="item-details-sidebar">
                            <!-- Start Single Block -->
                            <div class="single-block author">
                                <h3>Thông tin Người Bán</h3>
                                <div class="content">
                                    <img src="https://via.placeholder.com/150" alt="#">
                                    <h4 id="pd-seller-name">Đang tải...</h4>
                                    <span>Người bán cá nhân</span>
                                    <a href="javascript:void(0)" class="see-all">Xem tất cả bài đăng</a>
                                </div>
                            </div>
                            <!-- End Single Block -->
                            <!-- Start Single Block -->
                            <div class="single-block contant-seller">
                                <h3>Liên hệ Người Bán</h3>
                                <form action="javascript:void(0)">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="form-group">
                                                <input type="text" placeholder="Tên của bạn" required="required">
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <input type="email" placeholder="Địa chỉ Email" required="required">
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group">
                                                <textarea placeholder="Tin nhắn" name="message" id="message" rows="5"></textarea>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <div class="form-group button mb-0">
                                                <button type="submit" class="btn ">Gửi Tin Nhắn</button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- End Single Block -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- End Item Details -->

    <!-- ========================= footer start ========================= -->
    <footer class="footer">
        <div class="footer-bottom">
            <div class="container">
                <div class="inner">
                    <div class="row">
                        <div class="col-12">
                            <div class="content">
                                <p class="copyright-text">Thiết kế và Phát triển bởi <a href="javascript:void(0)" rel="nofollow" target="_blank">Lochnt0228</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!--/ End Footer Area -->

    <!-- ========================= scroll-top ========================= -->
    <a href="#" class="scroll-top btn-hover">
        <i class="lni lni-chevron-up"></i>
    </a>

    <!-- ========================= JS here ========================= -->
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <script src="assets/js/main.js"></script>
    
    <!-- Auth Scripts (FE1) -->
    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/auth-navbar.js"></script>
    
    <!-- Product Details Script -->
    <script src="js/product-details.js"></script>

</body>
</html>
