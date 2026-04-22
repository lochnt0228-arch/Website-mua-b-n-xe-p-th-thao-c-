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

/**
 * Show alert
 */
function showAlert(message, type = 'danger') {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

/**
 * Format date
 */
function formatDate(dateString) {
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
    // Show loading skeleton
    loadingSkeleton.style.display = 'block';
    profileContent.style.display = 'none';

    const user = auth.getCurrentUser();

    if (!user) {
      // Fetch from server if not in localStorage
      const result = await auth.fetchProfile();
      
      if (!result.success) {
        showAlert('Không thể tải hồ sơ: ' + result.message, 'danger');
        loadingSkeleton.style.display = 'none';
        return;
      }
    }

    // Get updated user
    const currentUser = auth.getCurrentUser();

    if (!currentUser) {
      showAlert('Lỗi: Không tìm thấy thông tin người dùng', 'danger');
      loadingSkeleton.style.display = 'none';
      return;
    }

    // Populate profile
    userFullName.textContent = currentUser.name || '-';
    userId.textContent = currentUser.user_id || '-';
    userEmail.textContent = currentUser.email || '-';
    
    if (currentUser.created_at) {
      userCreatedAt.textContent = formatDate(currentUser.created_at);
    } else {
      userCreatedAt.textContent = '-';
    }

    // Update navbar
    if (userNameDisplay) {
      userNameDisplay.textContent = currentUser.name || 'Tài Khoản';
    }

    // Hide skeleton, show content
    loadingSkeleton.style.display = 'none';
    profileContent.style.display = 'block';

  } catch (error) {
    console.error('Error loading profile:', error);
    showAlert('Lỗi: ' + error.message, 'danger');
    loadingSkeleton.style.display = 'none';
  }
}

/**
 * Event Listeners
 */

// Refresh button
refreshBtn.addEventListener('click', function() {
  loadProfile();
  showAlert('Hồ sơ đã được làm mới', 'success');
});

// Edit button (disabled for now)
editBtn.addEventListener('click', function() {
  showAlert('Tính năng chỉnh sửa sẽ sớm có', 'info');
});

// Logout button
if (logoutBtn) {
  logoutBtn.addEventListener('click', function(e) {
    e.preventDefault();
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      auth.logout();
    }
  });
}

// Load profile on page load
document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
});
