/**
 * ========================================
 * REGISTER.JS - Form Logic for Register Page
 * ========================================
 */

// DOM Elements
const registerForm = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const agreeTermsCheckbox = document.getElementById('agree-terms');
const registerBtn = document.getElementById('register-btn');
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
    registerBtn.disabled = true;
    loadingSpinner.classList.remove('d-none');
    document.querySelector('.button-text').textContent = 'Đang tạo tài khoản...';
  } else {
    registerBtn.disabled = false;
    loadingSpinner.classList.add('d-none');
    document.querySelector('.button-text').textContent = 'Tạo Tài Khoản';
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
  document.getElementById('name-error').textContent = '';
  document.getElementById('email-error').textContent = '';
  document.getElementById('password-error').textContent = '';
  document.getElementById('password-confirm-error').textContent = '';
  document.getElementById('terms-error').textContent = '';

  // Validate name
  if (!nameInput.value.trim()) {
    document.getElementById('name-error').textContent = 'Họ tên không được để trống';
    isValid = false;
  } else if (nameInput.value.trim().length < 3) {
    document.getElementById('name-error').textContent = 'Họ tên phải có ít nhất 3 ký tự';
    isValid = false;
  }

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
  } else if (passwordInput.value.length < 6) {
    document.getElementById('password-error').textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
    isValid = false;
  }

  // Validate password confirm
  if (!passwordConfirmInput.value) {
    document.getElementById('password-confirm-error').textContent = 'Xác nhận mật khẩu không được để trống';
    isValid = false;
  } else if (passwordInput.value !== passwordConfirmInput.value) {
    document.getElementById('password-confirm-error').textContent = 'Mật khẩu không khớp';
    isValid = false;
  }

  // Validate terms agreement
  if (!agreeTermsCheckbox.checked) {
    document.getElementById('terms-error').textContent = 'Bạn phải đồng ý với điều khoản dịch vụ';
    isValid = false;
  }

  return isValid;
}

/**
 * Handle form submit
 */
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideAlert();

  // Validate form
  if (!validateForm()) {
    return;
  }

  // Show loading state
  setLoading(true);

  try {
    // Call register API
    const result = await auth.register(
      nameInput.value,
      emailInput.value,
      passwordInput.value,
      passwordConfirmInput.value
    );

    if (result.success) {
      // Show success message
      showAlert('Tạo tài khoản thành công! Đang chuyển hướng...', 'success');

      // Redirect after registration
      setTimeout(() => {
        // If auto-login was successful (token in result)
        if (auth.isAuthenticated()) {
          routeGuard.redirectAfterLogin();
        } else {
          window.location.href = '/login.php';
        }
      }, 1500);
    } else {
      showAlert(result.message || 'Tạo tài khoản thất bại', 'danger');
    }
  } catch (error) {
    console.error('Register error:', error);
    showAlert('Lỗi: ' + error.message, 'danger');
  } finally {
    setLoading(false);
  }
});

/**
 * Clear error on input
 */
nameInput.addEventListener('input', function() {
  if (document.getElementById('name-error').textContent) {
    document.getElementById('name-error').textContent = '';
  }
});

emailInput.addEventListener('input', function() {
  if (document.getElementById('email-error').textContent) {
    document.getElementById('email-error').textContent = '';
  }
});

passwordInput.addEventListener('input', function() {
  if (document.getElementById('password-error').textContent) {
    document.getElementById('password-error').textContent = '';
  }
});

passwordConfirmInput.addEventListener('input', function() {
  if (document.getElementById('password-confirm-error').textContent) {
    document.getElementById('password-confirm-error').textContent = '';
  }
});
