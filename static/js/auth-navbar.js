/**
 * ========================================
 * AUTH-NAVBAR.JS - Dynamic Navbar Updates
 * ========================================
 * 
 * Chức năng:
 * 1. Cập nhật navbar khi user login/logout
 * 2. Hiển thị user menu khi đã login
 * 3. Hiển thị login/register buttons khi chưa login
 * 4. Thêm link "Đăng Bán" chỉ khi đã login
 */

/**
 * Build authenticated navbar (user is logged in)
 */
function buildAuthenticatedNavbar() {
  const container = document.getElementById('auth-buttons-container');
  if (!container) return;

  const user = auth.getCurrentUser();
  const userName = user ? user.name : 'Tài Khoản';

  // Nếu navbar đã chứa profile links, bỏ qua
  if (container.querySelector('.dropdown-toggle')) return;

  // Xóa login/register buttons nếu có
  container.innerHTML = '';

  // Thêm "Đăng Bán" link
  const nav = document.querySelector('ul#nav');
  if (nav && !nav.querySelector('li:has(a[href*="sell.php"])')) {
    const sellItem = document.createElement('li');
    sellItem.className = 'nav-item';
    sellItem.innerHTML = '<a href="sell.php" class="nav-link fw-bold text-primary">Đăng Bán</a>';
    nav.appendChild(sellItem);
  }

  // Thêm user dropdown
  container.innerHTML = `
    <div class="dropdown">
      <button class="btn btn-sm btn-outline-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="lni lni-user"></i> ${userName}
      </button>
      <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
        <li><a class="dropdown-item" href="profile.php"><i class="lni lni-user"></i> Hồ Sơ Cá Nhân</a></li>
        <li><a class="dropdown-item" href="my-ads.php"><i class="lni lni-package"></i> Tin Đăng Của Tôi</a></li>
        <li><a class="dropdown-item" href="cart.php"><i class="lni lni-cart"></i> Giỏ Hàng</a></li>
        <li><a class="dropdown-item" href="my-orders.php"><i class="lni lni-files"></i> Đơn Mua</a></li>
        <li><hr class="dropdown-divider"></li>
        <li><a class="dropdown-item text-danger" href="#" id="auth-logout-btn"><i class="lni lni-exit"></i> Đăng Xuất</a></li>
      </ul>
    </div>
  `;

  // Attach logout event
  const logoutBtn = document.getElementById('auth-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        auth.logout();
      }
    });
  }
}

/**
 * Build unauthenticated navbar (user is NOT logged in)
 */
function buildUnauthenticatedNavbar() {
  const container = document.getElementById('auth-buttons-container');
  if (!container) return;

  // Xóa nội dung cũ
  container.innerHTML = '';

  // Nếu đã có buttons, bỏ qua
  if (container.querySelector('.btn')) return;

  // Thêm login/register buttons
  container.innerHTML = `
    <a href="login.php" class="btn btn-outline-primary btn-sm">
      <i class="lni lni-enter"></i> Đăng Nhập
    </a>
    <a href="register.php" class="btn btn-primary btn-sm">
      <i class="lni lni-user"></i> Đăng Ký
    </a>
  `;
}

/**
 * Update navbar based on auth state
 */
function updateNavbar() {
  const isAuthenticated = auth.isAuthenticated();

  if (isAuthenticated) {
    buildAuthenticatedNavbar();
  } else {
    buildUnauthenticatedNavbar();
  }
}

/**
 * Reinitialize navbar on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  // Chỉ chạy nếu api.js và auth.js đã load
  if (window.api && window.auth) {
    updateNavbar();
  } else {
    console.warn('AuthNavbar: api.js hoặc auth.js chưa load');
  }
});

// Export functions
const authNavbar = {
  updateNavbar,
  buildAuthenticatedNavbar,
  buildUnauthenticatedNavbar
};

window.authNavbar = authNavbar;

// Listen for logout (when user logs out on another tab/window)
window.addEventListener('storage', function(e) {
  if (e.key === 'auth_token' && e.newValue === null) {
    // Token was removed, update navbar
    updateNavbar();
  }
});
