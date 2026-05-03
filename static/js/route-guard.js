/**
 * ========================================
 * ROUTE-GUARD.JS - Route Protection
 * ========================================
 * 
 * Chức năng:
 * 1. Bảo vệ các route yêu cầu đăng nhập (sell.html, cart.html, profile.html)
 * 2. Tự động redirect tới login nếu chưa authenticated
 * 3. Có thể thêm role-based protection (seller, buyer, admin)
 * 
 * Cách sử dụng:
 * - Thêm script này vào <head> của các trang protected
 * - Hoặc gọi checkAuth() khi trang load
 */

/**
 * Danh sách các route yêu cầu authentication
 */
const PROTECTED_ROUTES = [
  '/sell.php',
  '/profile.php',
  '/checkout.php',
  '/my-orders.php',
  '/my-ads.php'
];

/**
 * Danh sách các route chỉ accessible khi CHƯA login
 */
const AUTH_ONLY_ROUTES = [
  '/login.php',
  '/register.php'
];

/**
 * Kiểm tra xem trang hiện tại có yêu cầu authentication không
 * @returns {boolean}
 */
function isCurrentPageProtected() {
  const currentPath = window.location.pathname;
  return PROTECTED_ROUTES.some(route => currentPath.includes(route));
}

/**
 * Kiểm tra xem trang hiện tại chỉ cho chưa login
 * @returns {boolean}
 */
function isCurrentPageAuthOnly() {
  const currentPath = window.location.pathname;
  return AUTH_ONLY_ROUTES.some(route => currentPath.includes(route));
}

/**
 * Kiểm tra authentication và redirect nếu cần
 */
function checkAuth() {
  const isAuthenticated = auth.isAuthenticated();
  const isProtected = isCurrentPageProtected();
  const isAuthOnly = isCurrentPageAuthOnly();

  // Nếu trang yêu cầu authentication nhưng user chưa login
  if (isProtected && !isAuthenticated) {
    // Lưu URL hiện tại để redirect sau khi login
    const currentUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    
    window.location.href = '/login.php?next=' + encodeURIComponent(currentUrl);
    return false;
  }

  // Nếu trang chỉ cho chưa login (login, register) nhưng user đã login
  if (isAuthOnly && isAuthenticated) {
    window.location.href = '/index.php';
    return false;
  }

  return true;
}

/**
 * Force logout và redirect
 */
function requireLogout() {
  if (auth.isAuthenticated()) {
    auth.logout();
  }
}

/**
 * Force authentication
 */
function requireAuth() {
  if (!auth.isAuthenticated()) {
    const currentUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem('redirectAfterLogin', currentUrl);
    window.location.href = '/login.php?next=' + encodeURIComponent(currentUrl);
  }
}

/**
 * Redirect after login
 */
function redirectAfterLogin() {
  const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
  
  if (redirectUrl) {
    sessionStorage.removeItem('redirectAfterLogin');
    window.location.href = redirectUrl;
  } else {
    window.location.href = '/index.php';
  }
}

/**
 * Thêm guard vào tất cả protected routes tự động
 * Chạy khi DOM load xong
 */
document.addEventListener('DOMContentLoaded', function() {
  // Chỉ chạy nếu api.js và auth.js đã load
  if (window.api && window.auth) {
    checkAuth();
  } else {
    console.warn('RouteGuard: api.js hoặc auth.js chưa load');
  }
});

// Export functions
const routeGuard = {
  checkAuth,
  isCurrentPageProtected,
  isCurrentPageAuthOnly,
  requireAuth,
  requireLogout,
  redirectAfterLogin
};

window.routeGuard = routeGuard;
