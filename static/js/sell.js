/**
 * ========================================
 * SELL.JS - Xử lý đăng bài bán xe & Upload ảnh
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function () {
    const sellForm = document.getElementById('sellForm');
    const imageInput = document.getElementById('images');
    const previewContainer = document.getElementById('image-preview');

    if (!sellForm) return;

    // 1. Xử lý Xem trước hình ảnh (Image Preview)
    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', function () {
            previewContainer.innerHTML = ''; // Clear cũ
            const files = Array.from(this.files);

            if (files.length > 5) {
                alert('Bạn chỉ được chọn tối đa 5 ảnh. 5 ảnh đầu tiên sẽ được giữ lại.');
                // Cắt bớt files nếu cần (tùy chọn UI)
            }

            files.slice(0, 5).forEach(file => {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = document.createElement('div');
                    img.className = 'position-relative';
                    img.innerHTML = `
                        <img src="${e.target.result}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;">
                    `;
                    previewContainer.appendChild(img);
                }
                reader.readAsDataURL(file);
            });
        });
    }

    // 2. Xử lý Submit Form
    sellForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btnSubmit = document.getElementById('btnSubmitSell');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Đang xử lý bài đăng...';

        const bikeData = {
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            category_id: document.getElementById('category_id').value,
            brand_id: document.getElementById('brand_id').value,
            frame_size: document.getElementById('frame_size').value || null,
            frame_material: document.getElementById('frame_material').value || null,
            description: document.getElementById('description').value || null
        };

        try {
            // Bước A: Tạo bài đăng trước
            const bikeResult = await api.post('/api/bikes', bikeData);
            
            if (bikeResult.success) {
                const postId = bikeResult.data.post_id;
                
                // Bước B: Nếu có chọn ảnh -> Upload ảnh
                const files = imageInput.files;
                if (files && files.length > 0) {
                    btnSubmit.textContent = 'Đang upload hình ảnh...';
                    
                    const formData = new FormData();
                    // Lưu ý: field name phải là 'images' đúng như backend multer mong đợi
                    Array.from(files).slice(0, 5).forEach(file => {
                        formData.append('images', file);
                    });

                    // Gọi API upload (cần dùng FormData nên không dùng được api.post mặc định nếu api.js chưa hỗ trợ multipart)
                    // Hãy kiểm tra api.js xem có hỗ trợ upload không
                    const uploadResult = await uploadImages(postId, formData);
                    
                    if (!uploadResult.success) {
                        alert('Bài đăng đã tạo nhưng upload ảnh thất bại: ' + uploadResult.message);
                    }
                }

                alert('Đăng bán thành công!');
                window.location.href = 'my-ads.php';
            } else {
                alert('Lỗi: ' + bikeResult.message);
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Đăng Bán';
            }
        } catch (err) {
            console.error('Lỗi khi đăng bán:', err);
            alert('Có lỗi xảy ra khi kết nối máy chủ.');
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Đăng Bán';
        }
    });

    /**
     * Hàm hỗ trợ upload ảnh (vì api.js thường gửi JSON, upload cần FormData)
     */
    async function uploadImages(postId, formData) {
        const token = localStorage.getItem('auth_token');
        try {
            const response = await fetch(`/api.php?path=/api/bikes/${postId}/images`, {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                    // Không set Content-Type để trình duyệt tự set Multipart/form-data kèm boundary
                },
                body: formData
            });
            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
});
