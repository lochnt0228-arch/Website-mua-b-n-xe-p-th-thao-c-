/**
 * ========================================
 * CHECKOUT.JS - Xử lý đặt hàng
 * ========================================
 */

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    if (!postId) {
        alert('Lỗi: Không tìm thấy sản phẩm để thanh toán.');
        window.location.href = 'index.php';
        return;
    }

    const summaryContainer = document.getElementById('checkout-summary');
    let bikeData = null;
    const shippingFee = 50000;

    // Load thông tin xe
    try {
        const result = await api.get('/api/bikes/' + postId);
        if (result.success && result.data) {
            bikeData = result.data;
            const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bikeData.price);
            const formatTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(bikeData.price) + shippingFee);

            summaryContainer.innerHTML = `
                <h4 class="card-title mb-4">Tóm Tắt Đơn Hàng</h4>
                <div class="d-flex align-items-center border-bottom pb-3 mb-3">
                    <img src="assets/images/items-grid/img1.jpg" alt="Product" style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px;">
                    <div class="ms-3 flex-grow-1">
                        <h6 class="mb-1">${bikeData.title}</h6>
                        <div class="d-flex justify-content-between">
                            <small class="text-muted">Được bán bởi: ${bikeData.seller_name}</small>
                        </div>
                    </div>
                </div>
                
                <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Tạm tính:</span>
                    <span class="fw-bold">${formatPrice}</span>
                </div>
                <div class="d-flex justify-content-between mb-3 pb-3 border-bottom">
                    <span class="text-muted">Phí vận chuyển:</span>
                    <span class="fw-bold">50.000 ₫</span>
                </div>
                <div class="d-flex justify-content-between align-items-center fw-bold text-primary">
                    <span class="fs-5">Tổng cộng:</span>
                    <span class="fs-4">${formatTotal}</span>
                </div>
            `;
        } else {
            summaryContainer.innerHTML = '<div class="text-center text-danger">Không tìm thấy sản phẩm.</div>';
            alert('Không tìm thấy sản phẩm. Có thể đã bị bán.');
            window.location.href = 'index.php';
        }
    } catch (err) {
        summaryContainer.innerHTML = '<div class="text-center text-danger">Lỗi kết nối.</div>';
    }

    // Submit form
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (!bikeData) {
                alert('Dữ liệu xe chưa được tải xong.');
                return;
            }

            const btnSubmit = document.getElementById('btnSubmitOrder');
            btnSubmit.disabled = true;
            btnSubmit.textContent = 'Đang xử lý...';

            // Gom địa chỉ
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const notes = document.getElementById('notes').value;
            const shippingAddress = `${fullName} - ${phone} - ${address}` + (notes ? ` (Ghi chú: ${notes})` : '');

            // Phương thức thanh toán
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            const orderData = {
                post_id: postId,
                shipping_address: shippingAddress,
                payment_method: paymentMethod
            };

            try {
                const res = await api.post('/api/orders', orderData);
                if (res.success) {
                    alert('Đặt hàng thành công!');
                    window.location.href = 'my-orders.php';
                } else {
                    alert('Lỗi: ' + res.message);
                    btnSubmit.disabled = false;
                    btnSubmit.textContent = 'Xác Nhận Đặt Hàng';
                }
            } catch (err) {
                console.error(err);
                alert('Lỗi kết nối khi đặt hàng.');
                btnSubmit.disabled = false;
                btnSubmit.textContent = 'Xác Nhận Đặt Hàng';
            }
        });
    }
});
