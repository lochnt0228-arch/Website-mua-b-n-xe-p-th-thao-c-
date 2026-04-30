<?php include 'includes/header.php'; ?>


    <!-- Start Main Content -->
    <main>
        <!-- Start Register Section -->
        <section class="py-5 my-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-5 col-md-7">
                        <div class="card shadow-lg">
                            <div class="card-body p-5">
                                <h2 class="card-title text-center mb-4">Đăng Ký</h2>

                                <!-- Alert Messages -->
                                <div id="alert-container"></div>

                                <!-- Register Form -->
                                <form id="register-form">
                                    <!-- Full Name -->
                                    <div class="mb-3">
                                        <label for="name" class="form-label">Họ Tên <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="name" name="name" required 
                                            placeholder="Nhập họ tên của bạn">
                                        <small class="text-danger" id="name-error"></small>
                                    </div>

                                    <!-- Email -->
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                                        <input type="email" class="form-control" id="email" name="email" required 
                                            placeholder="Nhập email của bạn">
                                        <small class="text-danger" id="email-error"></small>
                                    </div>

                                    <!-- Password -->
                                    <div class="mb-3">
                                        <label for="password" class="form-label">Mật Khẩu <span class="text-danger">*</span></label>
                                        <input type="password" class="form-control" id="password" name="password" required 
                                            placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)">
                                        <small class="text-danger" id="password-error"></small>
                                        <small class="text-muted d-block mt-1">Mật khẩu phải có ít nhất 6 ký tự</small>
                                    </div>

                                    <!-- Confirm Password -->
                                    <div class="mb-4">
                                        <label for="password-confirm" class="form-label">Xác Nhận Mật Khẩu <span class="text-danger">*</span></label>
                                        <input type="password" class="form-control" id="password-confirm" name="password-confirm" required 
                                            placeholder="Xác nhận mật khẩu">
                                        <small class="text-danger" id="password-confirm-error"></small>
                                    </div>

                                    <!-- Terms Agreement -->
                                    <div class="mb-4 form-check">
                                        <input type="checkbox" class="form-check-input" id="agree-terms" name="agree-terms" required>
                                        <label class="form-check-label" for="agree-terms">
                                            Tôi đồng ý với <a href="#" class="text-primary">điều khoản dịch vụ</a> và <a href="#" class="text-primary">chính sách riêng tư</a>
                                        </label>
                                        <small class="text-danger" id="terms-error"></small>
                                    </div>

                                    <!-- Submit Button -->
                                    <button type="submit" class="btn btn-primary w-100 mb-3" id="register-btn">
                                        <span class="button-text">Tạo Tài Khoản</span>
                                        <span class="spinner-border spinner-border-sm ms-2 d-none" id="loading-spinner"></span>
                                    </button>
                                </form>

                                <!-- Login Link -->
                                <div class="text-center">
                                    <p>Đã có tài khoản? <a href="login.php" class="text-primary">Đăng nhập</a></p>
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
    <script src="js/register.js"></script>
</body>

</html>
