/**
 * ========================================
 * SELL.JS - Xử lý đăng bài bán xe
 * ========================================
 */

document.addEventListener('DOMContentLoaded', function () {
    const sellForm = document.getElementById('sellForm');
    if (!sellForm) return;

    sellForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const btnSubmit = document.getElementById('btnSubmitSell');
        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Đang xử lý...';

        const data = {
            title: document.getElementById('title').value,
            price: document.getElementById('price').value,
            category_id: document.getElementById('category_id').value,
            brand_id: document.getElementById('brand_id').value,
            frame_size: document.getElementById('frame_size').value || null,
            frame_material: document.getElementById('frame_material').value || null,
            description: document.getElementById('description').value || null
        };

        try {
            const result = await api.post('/api/bikes', data);
            
            if (result.success) {
                alert('Đăng bán thành công! Sản phẩm của bạn đã lên sàn.');
                window.location.href = 'my-ads.php';
            } else {
                alert('Lỗi: ' + result.message);
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
});
