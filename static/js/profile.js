/**
 * ========================================
 * PROFILE.JS - Profile Page Logic
 * ========================================
 */

// DOM Elements
const loadingSkeleton = document.getElementById('loading-skeleton');
const profileContent = document.getElementById('profile-content');
const userFullName = document.getElementById('user-full-name');
const userId = document.getElementById('user-id');
const userEmail = document.getElementById('user-email');
const userCreatedAt = document.getElementById('user-created-at');
const userNameDisplay = document.getElementById('user-name');
const refreshBtn = document.getElementById('refresh-btn');
const editBtn = document.getElementById('edit-btn');
const logoutBtn = document.getElementById('logout-btn');
const alertContainer = document.getElementById('alert-container');
const adsCount = document.getElementById('ads-count');
const ordersCount = document.getElementById('orders-count');

// Edit Profile Elements
const editNameInput = document.getElementById('edit-name');
const editPasswordInput = document.getElementById('edit-password');
const editConfirmPasswordInput = document.getElementById('edit-confirm-password');
const saveProfileBtn = document.getElementById('save-profile-btn');
const editAlert = document.getElementById('edit-alert');
let editModal;

/**
 * Show alert safely
 */
function showAlert(message, type = 'danger') {
  if (alertContainer) {
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
  }
}

/**
 * Format date safely
 */
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Load user profile
 */
async function loadProfile() {
  try {
    if (loadingSkeleton) loadingSkeleton.style.display = 'block';
    if (profileContent) profileContent.style.display = 'none';

    // Fetch from server to get latest data
    const result = await auth.fetchProfile();
    
    if (!result.success) {
        showAlert('Không thể tải hồ sơ: ' + result.message, 'danger');
        if (loadingSkeleton) loadingSkeleton.style.display = 'none';
        return;
    }

    const currentUser = auth.getCurrentUser();
    if (!currentUser) throw new Error("Không tìm thấy thông tin người dùng");

    // Populate profile safely
    if (userFullName) userFullName.textContent = currentUser.name || '-';
    if (userId) userId.textContent = currentUser.user_id || '-';
    if (userEmail) userEmail.textContent = currentUser.email || '-';
    if (userCreatedAt) userCreatedAt.textContent = formatDate(currentUser.created_at);

    // Populate edit form
    if (editNameInput) editNameInput.value = currentUser.name || '';

    // Update navbar if exists
    if (userNameDisplay) userNameDisplay.textContent = currentUser.name || 'Tài Khoản';

    // ALWAYS hide skeleton and show content here
    if (loadingSkeleton) loadingSkeleton.style.display = 'none';
    if (profileContent) profileContent.style.display = 'block';

    // Fetch stats in background
    fetchStats(currentUser);

  } catch (error) {
    console.error('Error loading profile:', error);
    showAlert('Lỗi: ' + error.message, 'danger');
    if (loadingSkeleton) loadingSkeleton.style.display = 'none';
  }
}

/**
 * Fetch stats (ads, orders)
 */
async function fetchStats(user) {
  try {
    // 1. Số tin đăng: Truyền status=ALL để lấy CẢ những bài đã bán (SOLD)
    const bikesResult = await api.get(`/api/bikes?seller_id=${user.user_id}&status=ALL`);
    
    if (bikesResult.success) {
        let count = 0;
        const d = bikesResult.data;
        // Backend trả về cấu trúc { bikes: [...] }
        if (d && Array.isArray(d.bikes)) count = d.bikes.length;
        else if (Array.isArray(d)) count = d.length;
        
        if (adsCount) adsCount.textContent = count;
    } else {
        if (adsCount) adsCount.textContent = '0';
    }

    // 2. Số đơn mua
    const ordersResult = await api.get('/api/orders/my');

    if (ordersResult.success) {
        let count = 0;
        const d = ordersResult.data;
        if (Array.isArray(d)) count = d.length;
        else if (d && Array.isArray(d.orders)) count = d.orders.length;
        else if (d && Array.isArray(d.data)) count = d.data.length;
        if (ordersCount) ordersCount.textContent = count;
    } else {
        if (ordersCount) ordersCount.textContent = '0';
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
  }
}

/**
 * Update Profile
 */
async function updateProfile() {
    if (!editNameInput) return;
    
    const name = editNameInput.value.trim();
    const password = editPasswordInput ? editPasswordInput.value : '';
    const confirmPassword = editConfirmPasswordInput ? editConfirmPasswordInput.value : '';

    if (editAlert) editAlert.classList.add('d-none');

    if (!name) {
        if (editAlert) {
            editAlert.textContent = 'Vui lòng nhập tên hiển thị';
            editAlert.classList.remove('d-none');
        }
        return;
    }

    if (password && password !== confirmPassword) {
        if (editAlert) {
            editAlert.textContent = 'Mật khẩu xác nhận không khớp';
            editAlert.classList.remove('d-none');
        }
        return;
    }

    if (saveProfileBtn) {
        saveProfileBtn.disabled = true;
        saveProfileBtn.textContent = 'Đang lưu...';
    }

    try {
        const updateData = { name };
        if (password) updateData.password = password;

        const result = await api.put('/api/users/profile', updateData);

        if (result.success) {
            if (editModal) editModal.hide();
            if (editPasswordInput) editPasswordInput.value = '';
            if (editConfirmPasswordInput) editConfirmPasswordInput.value = '';
            
            showAlert('Cập nhật hồ sơ thành công!', 'success');
            loadProfile();
        } else {
            if (editAlert) {
                editAlert.textContent = result.message;
                editAlert.classList.remove('d-none');
            }
        }
    } catch (error) {
        console.error('Update profile error:', error);
        if (editAlert) {
            editAlert.textContent = 'Lỗi kết nối máy chủ';
            editAlert.classList.remove('d-none');
        }
    } finally {
        if (saveProfileBtn) {
            saveProfileBtn.disabled = false;
            saveProfileBtn.textContent = 'Lưu thay đổi';
        }
    }
}

/**
 * Event Listeners
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Modal
    const modalEl = document.getElementById('editProfileModal');
    if (modalEl && typeof bootstrap !== 'undefined') {
        editModal = new bootstrap.Modal(modalEl);
    }

    loadProfile();

    if (refreshBtn) refreshBtn.addEventListener('click', loadProfile);
    if (saveProfileBtn) saveProfileBtn.addEventListener('click', updateProfile);

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                auth.logout();
            }
        });
    }
});
