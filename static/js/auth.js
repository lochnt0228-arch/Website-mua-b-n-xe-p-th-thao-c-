/**
 * ========================================
 * AUTH.JS - Authentication Logic
 * ========================================
 * 
 * Chức năng:
 * 1. Xử lý login (gọi API, lưu token & user)
 * 2. Xử lý register (gọi API, tự động login sau đó)
 * 3. Logout (xóa token & user, redirect home)
 * 4. Kiểm tra xem user đã đăng nhập chưa
 * 5. Lấy thông tin user hiện tại
 */

/**
 * Đăng nhập
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} { success, message, data }
 */
async function login(email, password) {
  if (!email || !password) {
    return { success: false, message: 'Email và password là bắt buộc', data: null };
  }

  const result = await api.post('/api/auth/login', { email, password });

  if (result.success && result.data && result.data.token) {
    // Lưu token và user info
    api.setToken(result.data.token);
    api.setUser(result.data.user);
  }

  return result;
}

/**
 * Đăng ký
 * @param {string} name 
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} { success, message, data }
 */
async function register(name, email, password, passwordConfirm) {
  if (!name || !email || !password || !passwordConfirm) {
    return { success: false, message: 'Tất cả các trường là bắt buộc', data: null };
  }

  if (password !== passwordConfirm) {
    return { success: false, message: 'Mật khẩu không khớp', data: null };
  }

  if (password.length < 6) {
    return { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự', data: null };
  }

  const result = await api.post('/api/auth/register', { name, email, password });

  if (result.success && result.data && result.data.token) {
    // Tự động đăng nhập sau khi đăng ký thành công
    api.setToken(result.data.token);
    api.setUser(result.data.user);
  }

  return result;
}

/**
 * Đăng xuất
 */
function logout() {
  api.clearToken();
  api.clearUser();
  window.location.href = '/index.php';
}

/**
 * Kiểm tra xem user đã đăng nhập chưa
 * @returns {boolean}
 */
function isAuthenticated() {
  return api.hasToken();
}

/**
 * Lấy thông tin user hiện tại
 * @returns {Object|null} User object hoặc null
 */
function getCurrentUser() {
  return api.getUser();
}

/**
 * Lấy token hiện tại
 * @returns {string|null}
 */
function getCurrentToken() {
  return api.getToken();
}

/**
 * Kiểm tra xem user có phải là seller không
 * Mở rộng: Có thể thêm role từ backend
 * @returns {boolean}
 */
function isSeller() {
  // Tạm thời: mọi user đăng nhập có thể là seller
  return isAuthenticated();
}

/**
 * Kiểm tra xem user có phải là buyer không
 * @returns {boolean}
 */
function isBuyer() {
  return isAuthenticated();
}

/**
 * Fetch thông tin profile từ server (mở rộng)
 * Sử dụng khi cần cập nhật user info từ server
 */
async function fetchProfile() {
  const result = await api.get('/api/auth/profile');
  
  if (result.success && result.data) {
    api.setUser(result.data);
  }
  
  return result;
}

// Export toàn bộ functions tới global scope
const auth = {
  login,
  register,
  logout,
  isAuthenticated,
  getCurrentUser,
  getCurrentToken,
  isSeller,
  isBuyer,
  fetchProfile
};

window.auth = auth;
