/**
 * ========================================
 * API.JS - Centralized API Client
 * ========================================
 * 
 * Chức năng chính:
 * 1. Cung cấp hàm fetch tập trung (request, get, post, put, delete)
 * 2. Tự động gắn JWT token vào header Authorization
 * 3. Xử lý lỗi 401 (Token hết hạn)
 * 4. Quản lý token (lưu, lấy, xóa)
 * 
 * Sử dụng:
 * - api.post('/api/auth/login', { email, password })
 * - api.get('/api/bikes')
 * - api.request('POST', '/api/orders', data)
 */

const API_BASE_URL = 'http://localhost:5000';
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

/**
 * ========== Token Management ==========
 */

// Lưu token vào localStorage
function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Lấy token từ localStorage
function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Xóa token khỏi localStorage
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Kiểm tra xem có token không
function hasToken() {
  return !!getToken();
}

// Lưu user info
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

// Lấy user info
function getUser() {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

// Xóa user info
function clearUser() {
  localStorage.removeItem(USER_KEY);
}

/**
 * ========== Centralized Request Handler ==========
 */

async function request(method, endpoint, body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  // Tự động gắn Authorization header nếu có token
  const token = getToken();
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  // Thêm body nếu là POST, PUT, PATCH
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Xử lý 401 - Token hết hạn hoặc không hợp lệ
    if (response.status === 401) {
      clearToken();
      clearUser();
      // Redirect tới login (nếu không phải trang login)
      if (!window.location.pathname.includes('/login.php')) {
        window.location.href = '/login.html?expired=true';
      }
      return {
        success: false,
        message: 'Token hết hạn, vui lòng đăng nhập lại',
        data: null
      };
    }

    // Xử lý các lỗi khác từ server
    if (!response.ok && !data.success) {
      return {
        success: false,
        message: data.message || `Lỗi ${response.status}: ${response.statusText}`,
        data: null
      };
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      message: `Lỗi kết nối: ${error.message}`,
      data: null
    };
  }
}

/**
 * ========== HTTP Method Shortcuts ==========
 */

const api = {
  // GET request
  get(endpoint) {
    return request('GET', endpoint);
  },

  // POST request
  post(endpoint, body) {
    return request('POST', endpoint, body);
  },

  // PUT request
  put(endpoint, body) {
    return request('PUT', endpoint, body);
  },

  // PATCH request
  patch(endpoint, body) {
    return request('PATCH', endpoint, body);
  },

  // DELETE request
  delete(endpoint) {
    return request('DELETE', endpoint);
  },

  // Generic request
  request(method, endpoint, body) {
    return request(method, endpoint, body);
  },

  // Token Management (public)
  setToken,
  getToken,
  clearToken,
  hasToken,
  setUser,
  getUser,
  clearUser
};

// Export cho global scope
window.api = api;
