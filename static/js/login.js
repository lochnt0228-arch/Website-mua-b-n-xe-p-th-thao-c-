/**
 * ========================================
 * LOGIN.JS - Form Logic for Login Page
 * ========================================
 */

// DOM Elements
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const loginBtn = document.getElementById('login-btn');
const loadingSpinner = document.getElementById('loading-spinner');
const alertContainer = document.getElementById('alert-container');

/**
 * Hiển thị alert message
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
 * Ẩn alert message
 */
function hideAlert() {
  alertContainer.innerHTML = '';
}

/**
 * Show loading state
 */
function setLoading(isLoading) {
  if (isLoading) {
    loginBtn.disabled = true;
    loadingSpinner.classList.remove('d-none');
    document.querySelector('.button-text').textContent = 'Đang đăng nhập...';
  } else {
    loginBtn.disabled = false;
    loadingSpinner.classList.add('d-none');
    document.querySelector('.button-text').textContent = 'Đăng Nhập';
  }
}

/**
 * Validate email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate form inputs
 */
function validateForm() {
  let isValid = true;
  
  // Clear previous errors
  document.getElementById('email-error').textContent = '';
  document.getElementById('password-error').textContent = '';

  // Validate email
  if (!emailInput.value.trim()) {
    document.getElementById('email-error').textContent = 'Email không được để trống';
    isValid = false;
  } else if (!validateEmail(emailInput.value)) {
    document.getElementById('email-error').textContent = 'Email không hợp lệ';
    isValid = false;
  }

  // Validate password
  if (!passwordInput.value) {
    document.getElementById('password-error').textContent = 'Mật khẩu không được để trống';
    isValid = false;
  }

  return isValid;
}

/**
 * Handle form submit
 */
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert();

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Show loading state
  setLoading(true);

  try {
    // Call login API
    const result = await auth.login(emailInput.value, passwordInput.value);

    if (result.success) {
      // Save remember me preference
      if (rememberCheckbox.checked) {
        localStorage.setItem('rememberEmail', emailInput.value);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      // Show success message
      showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');

      // Redirect after login
      setTimeout(() => {
        routeGuard.redirectAfterLogin();
      }, 1500);
    } else {
      showAlert(result.message || 'Đăng nhập thất bại', 'danger');
    }
  } catch (error) {
    console.error('Login error:', error);
    showAlert('Lỗi: ' + error.message, 'danger');
  } finally {
    setLoading(false);
  }
});

/**
 * Load remembered email on page load
 */
document.addEventListener('DOMContentLoaded', function() {
  const rememberedEmail = localStorage.getItem('rememberEmail');
  if (rememberedEmail) {
    emailInput.value = rememberedEmail;
    rememberCheckbox.checked = true;
  }

  // Check if token expired
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('expired') === 'true') {
    showAlert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.', 'warning');
  }
});
