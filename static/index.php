<?php include 'includes/header.php'; ?>

    <!-- End Header Area -->

    <!-- Start Hero Area -->
    <section class="hero-area overlay">
        <div class="container">
            <div class="row">
                <div class="col-lg-10 offset-lg-1 col-md-12 col-12">
                    <div class="hero-text text-center">
                        <!-- Start Hero Text -->
                        <div class="section-heading">
                            <h2 class="wow fadeInUp" data-wow-delay=".3s">Chào mừng đến với Chợ Xe Đạp Cũ</h2>
                            <p class="wow fadeInUp" data-wow-delay=".5s">Mua bán xe đạp thể thao cũ, phụ tùng và phụ kiện<br>một cách dễ dàng, nhanh chóng và an toàn.</p>
                        </div>
                        <!-- End Search Form -->
                        <!-- Start Search Form -->
                        <div class="search-form wow fadeInUp" data-wow-delay=".7s">
                            <div class="row">
                                <div class="col-lg-4 col-md-4 col-12 p-0" style="width: 50%">
                                    <div class="search-input">
                                        <label for="keyword"><i class="lni lni-search-alt theme-color"></i></label>
                                        <input type="text" name="keyword" id="keyword" placeholder="Từ khóa sản phẩm">
                                    </div>
                                </div>
                                <div class="col-lg-3 col-md-3 col-12 p-0" style="width: 25%">
                                    <div class="search-input">
                                        <label for="category"><i class="lni lni-grid-alt theme-color"></i></label>
                                        <select name="category" id="category">
                                            <option value="none" selected disabled>Danh Mục</option>
                                            <option value="none">Xe Đạp Địa Hình (MTB)</option>
                                            <option value="none">Xe Đạp Đua (Road)</option>
                                            <option value="none">Xe Đạp Touring</option>
                                            <option value="none">Xe Đạp Gấp</option>
                                            <option value="none">Phụ Tùng Xe</option>
                                            <option value="none">Đồ Bảo Hộ</option>
                                            <option value="none">Quần Áo Đạp Xe</option>
                                            <option value="none">Dịch Vụ Sửa Chữa</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="col-lg-2 col-md-2 col-12 p-0" style="width: 25%">
                                    <div class="search-btn button">
                                        <button class="btn"><i class="lni lni-search-alt"></i> Tìm Kiếm</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- End Search Form -->
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- End Hero Area -->

    <!-- Start Categories Area -->
    <section class="categories">
        <div class="container">
            <div class="cat-inner">
                <div class="row">
                    <div class="col-12 p-0">
                        <div id="category-stats-list" class="category-slider">
                            <!-- Dữ liệu động sẽ được đổ vào đây bằng JS -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- /End Categories Area -->

    <!-- Start Items Grid Area -->
    <section class="items-grid section custom-padding">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-title">
                        <h2 class="wow fadeInUp" data-wow-delay=".4s">Sản Phẩm Mới Nhất</h2>
                        <p class="wow fadeInUp" data-wow-delay=".6s">Danh sách các mẫu xe đạp thể thao và phụ kiện nổi bật vừa được đăng bán trên hệ thống.</p>
                    </div>
                </div>
            </div>
            <div class="single-head">
                <div class="row" id="bike-list-container">
                    <div class="col-12 text-center"><p>Đang tải dữ liệu xe...</p></div>
                </div>
            </div>
        </div>
    </section>
    <!-- /End Items Grid Area -->

    <!-- Start Why Choose Area -->
    <section class="why-choose section">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-title">
                        <h2 class="wow fadeInUp" data-wow-delay=".4s">Vì Sao Chọn Chúng Tôi</h2>
                        <p class="wow fadeInUp" data-wow-delay=".6s">Chúng tôi tự hào cung cấp nền tảng giao dịch xe đạp thể thao uy tín, an toàn và dễ sử dụng nhất cho người đam mê đạp xe.</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="choose-content">
                        <div class="row">
                            <div class="col-lg-4 col-md-6 col-12">
                                <!-- Start Single List -->
                                <div class="single-list wow fadeInUp" data-wow-delay=".2s">
                                    <i class="lni lni-book"></i>
                                    <h4>Thông Tin Rõ Ràng</h4>
                                    <p>Hỗ trợ người dùng đăng tin và tìm kiếm các sản phẩm xe đạp, phụ tùng một cách nhanh chóng và thuận tiện nhất.</p>
                                </div>
                                <!-- Start Single List -->
                            </div>
                            <div class="col-lg-4 col-md-6 col-12">
                                <!-- Start Single List -->
                                <div class="single-list wow fadeInUp" data-wow-delay=".4s">
                                    <i class="lni lni-leaf"></i>
                                    <h4>Giao Diện Hiện Đại</h4>
                                    <p>Hỗ trợ người dùng đăng tin và tìm kiếm các sản phẩm xe đạp, phụ tùng một cách nhanh chóng và thuận tiện nhất.</p>
                                </div>
                                <!-- Start Single List -->
                            </div>
                            <div class="col-lg-4 col-md-6 col-12">
                                <!-- Start Single List -->
                                <div class="single-list wow fadeInUp" data-wow-delay=".6s">
                                    <i class="lni lni-cog"></i>
                                    <h4>Dễ Dàng Tùy Chỉnh</h4>
                                    <p>Hỗ trợ người dùng đăng tin và tìm kiếm các sản phẩm xe đạp, phụ tùng một cách nhanh chóng và thuận tiện nhất.</p>
                                </div>
                                <!-- Start Single List -->
                            </div>
                            <div class="col-lg-4 col-md-6 col-12">
                                <!-- Start Single List -->
                                <div class="single-list wow fadeInUp" data-wow-delay=".2s">
                                    <i class="lni lni-pointer-up"></i>
                                    <h4>Dễ Sử Dụng</h4>
                                    <p>Hỗ trợ người dùng đăng tin và tìm kiếm các sản phẩm xe đạp, phụ tùng một cách nhanh chóng và thuận tiện nhất.</p>
                                </div>
                                <!-- Start Single List -->
                            </div>
                            <div class="col-lg-4 col-md-6 col-12">
                                <!-- Start Single List -->
                                <div class="single-list wow fadeInUp" data-wow-delay=".4s">
                                    <i class="lni lni-layout"></i>
                                    <h4>Bố Cục Rõ Ràng</h4>
                                    <p>Hỗ trợ người dùng đăng tin và tìm kiếm các sản phẩm xe đạp, phụ tùng một cách nhanh chóng và thuận tiện nhất.</p>
                                </div>
                                <!-- Start Single List -->
                            </div>
                            <div class="col-lg-4 col-md-6 col-12">
                                <!-- Start Single List -->
                                <div class="single-list wow fadeInUp" data-wow-delay=".6s">
                                    <i class="lni lni-laptop-phone"></i>
                                    <h4>Tương Thích Mọi Thiết Bị</h4>
                                    <p>Hỗ trợ người dùng đăng tin và tìm kiếm các sản phẩm xe đạp, phụ tùng một cách nhanh chóng và thuận tiện nhất.</p>
                                </div>
                                <!-- Start Single List -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- /End Why Choose Area -->

    <!-- Start How Works Area -->
    <section class="how-works section" style="background-color: #fff;">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="section-title">
                        <h2 class="wow fadeInUp" data-wow-delay=".4s">Hướng Dẫn Nhanh</h2>
                        <p class="wow fadeInUp" data-wow-delay=".6s">Chỉ với 3 bước đơn giản, bạn có thể dễ dàng mua hoặc bán xe đạp thể thao trên nền tảng của chúng tôi.</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-4 col-md-4 col-12">
                    <!-- Start Single Work -->
                    <div class="single-work wow fadeInUp" data-wow-delay=".2s">
                        <span class="serial">01</span>
                        <h3>Tạo Tài Khoản</h3>
                        <p>Đăng ký miễn phí và điền thông tin cá nhân cơ bản để bắt đầu tham gia cộng đồng.</p>
                    </div>
                    <!-- End Single Work -->
                </div>
                <div class="col-lg-4 col-md-4 col-12">
                    <!-- Start Single Work -->
                    <div class="single-work wow fadeInUp" data-wow-delay=".4s">
                        <span class="serial">02</span>
                        <h3>Đăng Tin Của Bạn</h3>
                        <p>Cung cấp chi tiết, hình ảnh và giá cả của chiếc xe bạn muốn bán để thu hút người mua.</p>
                    </div>
                    <!-- End Single Work -->
                </div>
                <div class="col-lg-4 col-md-4 col-12">
                    <!-- Start Single Work -->
                    <div class="single-work wow fadeInUp" data-wow-delay=".6s">
                        <span class="serial">03</span>
                        <h3>Bán Sản Phẩm</h3>
                        <p>Trao đổi với người mua tiềm năng, chốt giá và thực hiện giao dịch an toàn.</p>
                    </div>
                    <!-- End Single Work -->
                </div>
            </div>
        </div>
    </section>
    <!-- End How Works Area -->

<?php include 'includes/footer.php'; ?>

    <!-- ========================= scroll-top ========================= -->
    <a href="#" class="scroll-top btn-hover">
        <i class="lni lni-chevron-up"></i>
    </a>

    <!-- ========================= JS here ========================= -->
    <style>
        .single-grid {
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .single-grid .content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .single-grid .image img {
            transition: transform 0.3s ease;
        }
        .single-grid:hover .image img {
            transform: scale(1.05);
        }
    </style>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/wow.min.js"></script>
    <script src="assets/js/tiny-slider.js"></script>
    <script src="assets/js/glightbox.min.js"></script>
    <script src="assets/js/main.js"></script>
    <!-- Auth Scripts (FE1) -->
    <script src="js/api.js"></script>
    <script src="js/auth.js"></script>
    <script src="js/route-guard.js"></script>
    <script src="js/auth-navbar.js"></script>
    <script src="js/home-stats.js"></script>
    <script src="js/index.js"></script>
    <script src="js/search.js"></script>
    <script type="text/javascript">
        //========= Category Slider 
        tns({
            container: '.category-slider',
            items: 3,
            slideBy: 'page',
            autoplay: false,
            mouseDrag: true,
            gutter: 0,
            nav: false,
            controls: true,
            controlsText: ['<i class="lni lni-chevron-left"></i>', '<i class="lni lni-chevron-right"></i>'],
            responsive: {
                0: {
                    items: 1,
                },
                540: {
                    items: 2,
                },
                768: {
                    items: 4,
                },
                992: {
                    items: 5,
                },
                1170: {
                    items: 6,
                }
            }
        });
    </script>
</body>

</html>