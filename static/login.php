<?php include 'includes/header.php'; ?>


    <!-- Start Main Content -->
    <main>
        <!-- Start Login Section -->
        <section class="py-5 my-5">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-lg-5 col-md-7">
                        <div class="card shadow-lg">
                            <div class="card-body p-5">
                                <h2 class="card-title text-center mb-4">Đăng Nhập</h2>

                                <!-- Alert Messages -->
                                <div id="alert-container"></div>

                                <!-- Login Form -->
                                <form id="login-form">
                                    <!-- Email -->
                                    <div class="mb-3">
                                        <label for="email" class="form-label">Email <span class="text-danger">*</span></label>
                                        <input type="email" class="form-control" id="email" name="email" required 
                                            placeholder="Nhập email của bạn">
                                        <small class="text-danger" id="email-error"></small>
                                    </div>

                                    <!-- Password -->
                                    <div class="mb-4">
                                        <label for="password" class="form-label">Mật Khẩu <span class="text-danger">*</span></label>
                                        <input type="password" class="form-control" id="password" name="password" required 
                                            placeholder="Nhập mật khẩu">
                                        <small class="text-danger" id="password-error"></small>
                                    </div>

                                    <!-- Remember Me -->
                                    <div class="mb-4 form-check">
                                        <input type="checkbox" class="form-check-input" id="remember" name="remember">
                                        <label class="form-check-label" for="remember">Nhớ tôi</label>
                                    </div>

                                    <!-- Submit Button -->
                                    <button type="submit" class="btn btn-primary w-100 mb-3" id="login-btn">
                                        <span class="button-text">Đăng Nhập</span>
                                        <span class="spinner-border spinner-border-sm ms-2 d-none" id="loading-spinner"></span>
                                    </button>
                                </form>

                                <!-- Register Link -->
                                <div class="text-center">
                                    <p>Chưa có tài khoản? <a href="register.php" class="text-primary">Đăng ký ngay</a></p>
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
    <script src="js/login.js"></script>
</body>

</html>
