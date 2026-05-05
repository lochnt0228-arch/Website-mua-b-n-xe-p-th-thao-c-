/**
 * ========================================
 * MANAGE-ORDER.JS - Logic dành cho Người Bán
 * ========================================
 */

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderIdParam = urlParams.get('id');
    const postId = urlParams.get('post_id');

    const spinner = document.getElementById('loading-spinner');
    const content = document.getElementById('order-content');
    const statusBadge = document.getElementById('order-status-badge');

    let currentOrderId = orderIdParam; // Lưu order_id thực tế để gọi API cập nhật

    if (!orderIdParam && !postId) {
        alert("Không tìm thấy mã đơn hàng hoặc mã bài đăng!");
        if (spinner) spinner.style.display = 'none';
        window.location.href = 'my-ads.php';
        return;
    }

    try {
        const endpoint = orderIdParam ? `/api/orders/${orderIdParam}` : `/api/orders/by-post/${postId}`;
        const result = await api.get(endpoint);
        
        if (result.success && result.data) {
            const order = result.data;
            currentOrderId = order.order_id; // Cập nhật ID thực tế từ database

            if (statusBadge) {
                statusBadge.textContent = getStatusText(order.status);
                statusBadge.className = `badge ${getStatusClass(order.status)}`;
            }
            
            const elBuyerName = document.getElementById('buyer-name');
            if (elBuyerName) elBuyerName.textContent = order.display_name || order.buyer_name;

            const elBuyerEmail = document.getElementById('buyer-email');
            if (elBuyerEmail) elBuyerEmail.textContent = order.buyer_email;

            const elBuyerPhone = document.getElementById('buyer-phone');
            if (elBuyerPhone) elBuyerPhone.textContent = order.display_phone;

            const elAddress = document.getElementById('shipping-address');
            // Trong địa chỉ có ghi chú (Ghi chú: ...)
            const noteIndex = order.display_address.indexOf('(Ghi chú:');
            let baseAddress = order.display_address;
            let noteText = '';

            if (noteIndex !== -1) {
                baseAddress = order.display_address.substring(0, noteIndex).trim();
                noteText = order.display_address.substring(noteIndex + 9, order.display_address.lastIndexOf(')'));
            }
            if (elAddress) {
                elAddress.innerHTML = `
                    <p class="mb-1"><strong>Họ tên:</strong> ${order.display_name}</p>
                    <p class="mb-1"><strong>SĐT:</strong> ${order.display_phone}</p>
                    <p class="mb-0"><strong>Địa chỉ:</strong> ${baseAddress}</p>
                    ${noteText ? `<p class="mb-0 mt-1 text-muted"><strong>Ghi chú:</strong> ${noteText}</p>` : ''}
                `;
            }
            
            const elBikeTitle = document.getElementById('bike-title');
            if (elBikeTitle) elBikeTitle.textContent = order.bike_title;

            const elBikePrice = document.getElementById('bike-price');
            if (elBikePrice) {
                // Sửa lỗi: dùng order.price và thêm phí ship nếu có
                const totalPrice = Number(order.price) + (Number(order.shipping_fee) || 0);
                elBikePrice.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);
            }

            const elBikeImg = document.getElementById('bike-img');
            if (elBikeImg) elBikeImg.src = order.image_url || 'assets/images/items-grid/img1.jpg';

            setupActions(order);

            if (spinner) spinner.style.display = 'none';
            if (content) content.style.display = 'block';
        } else {
            alert(result.message || "Lỗi tải đơn hàng");
            if (spinner) spinner.style.display = 'none';
            window.location.href = 'my-ads.php';
        }
    } catch (error) {
        console.error(error);
        if (spinner) spinner.style.display = 'none';
    }

    function setupActions(order) {
        const btnShip = document.getElementById('btn-ship-order');
        const btnComplete = document.getElementById('btn-complete-order');
        const btnCancel = document.getElementById('btn-cancel-order');

        if (!btnShip || !btnComplete || !btnCancel) return;

        btnShip.style.display = 'none';
        btnComplete.style.display = 'none';
        btnCancel.style.display = 'none';

        if (order.status === 'PENDING' || order.status === 'PAID') {
            btnShip.style.display = 'block';
            btnCancel.style.display = 'block';
        } else if (order.status === 'SHIPPING') {
            btnComplete.style.display = 'block';
        }

        btnShip.onclick = () => updateStatus('SHIPPING');
        btnComplete.onclick = () => updateStatus('COMPLETED');
        btnCancel.onclick = () => {
            if(confirm('Bạn có chắc muốn hủy đơn hàng này?')) updateStatus('CANCELLED');
        };
    }

    async function updateStatus(newStatus) {
        if (!currentOrderId) {
            alert("Không tìm thấy mã đơn hàng để cập nhật!");
            return;
        }
        try {
            const res = await api.put(`/api/orders/${currentOrderId}/status`, { status: newStatus });
            if (res.success) {
                alert('Cập nhật trạng thái thành công!');
                window.location.reload();
            } else {
                alert(res.message);
            }
        } catch (e) {
            alert('Lỗi khi cập nhật trạng thái');
        }
    }

    function getStatusText(status) {
        const map = {
            'PENDING': 'Chờ xử lý',
            'PAID': 'Đã thanh toán',
            'SHIPPING': 'Đang giao hàng',
            'COMPLETED': 'Hoàn tất',
            'CANCELLED': 'Đã hủy'
        };
        return map[status] || status;
    }

    function getStatusClass(status) {
        const map = {
            'PENDING': 'bg-warning text-dark',
            'PAID': 'bg-info',
            'SHIPPING': 'bg-primary',
            'COMPLETED': 'bg-success',
            'CANCELLED': 'bg-danger'
        };
        return map[status] || 'bg-secondary';
    }
});
