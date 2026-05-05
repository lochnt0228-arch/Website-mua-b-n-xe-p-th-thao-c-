/**
 * ========================================
 * ORDER-DETAILS.JS - Logic dành cho Người Mua
 * ========================================
 */

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('id');

    const spinner = document.getElementById('loading-spinner');
    const content = document.getElementById('order-content');
    const statusBadge = document.getElementById('order-status-badge');

    if (!orderId) {
        alert("Không tìm thấy mã đơn hàng!");
        if (spinner) spinner.style.display = 'none';
        window.location.href = 'my-orders.php';
        return;
    }

    try {
        const result = await api.get(`/api/orders/${orderId}`);
        
        if (result.success && result.data) {
            const order = result.data;
            
            // Điền thông tin an toàn (Safe populate)
            if (statusBadge) {
                statusBadge.textContent = getStatusText(order.status);
                statusBadge.className = `badge ${getStatusClass(order.status)}`;
            }
            
            const elSellerName = document.getElementById('seller-name');
            if (elSellerName) elSellerName.textContent = order.seller_name;

            const elSellerEmail = document.getElementById('seller-email');
            if (elSellerEmail) elSellerEmail.textContent = order.seller_email;

            const elAddress = document.getElementById('shipping-address');
            // Trong địa chỉ có ghi chú (Ghi chú: ...)
            const noteIndex = order.display_address.indexOf('(Ghi chú:');
            let baseAddress = order.display_address;
            let noteText = '';

            if (noteIndex !== -1) {
                baseAddress = order.display_address.substring(0, noteIndex).trim();
                noteText = order.display_address.substring(noteIndex + 1, order.display_address.lastIndexOf(')'));
            }

            if (elAddress) {
                // Hiển thị thông tin người nhận đã tách cho người mua xem lại
                elAddress.innerHTML = `
                    <p class="mb-1"><strong>Người nhận:</strong> ${order.display_name}</p>
                    <p class="mb-1"><strong>Số điện thoại:</strong> ${order.display_phone}</p>
                    <p class="mb-0"><strong>Địa chỉ:</strong> ${baseAddress}</p>
                    ${noteText ? `<p class="mb-0 mt-1 text-muted"><strong>Ghi chú:</strong> ${noteText}</p>` : ''}
                `;
            }
            
            const elBikeTitle = document.getElementById('bike-title');
            if (elBikeTitle) elBikeTitle.textContent = order.bike_title;

            const elBikePrice = document.getElementById('bike-price');
            if (elBikePrice) {
                // Sửa lỗi NaN: Chuyển đổi sang Number trước khi tính toán
                const totalPrice = Number(order.price) + (Number(order.shipping_fee) || 0);
                elBikePrice.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);
            }

            const elBikeImg = document.getElementById('bike-img');
            if (elBikeImg) elBikeImg.src = order.image_url || 'assets/images/items-grid/img1.jpg';

            const elOrderDate = document.getElementById('order-date');
            if (elOrderDate) elOrderDate.textContent = new Date(order.created_at).toLocaleDateString('vi-VN');

            // Ghi chú giao hàng
            const elShippingNote = document.getElementById('shipping-note');
            if (elShippingNote) {
                if (order.status === 'SHIPPING') {
                    elShippingNote.style.display = 'block';
                    elShippingNote.innerHTML = '<i class="lni lni-delivery"></i> Đơn hàng đang trên đường đến với bạn!';
                } else if (order.status === 'PENDING') {
                    elShippingNote.style.display = 'block';
                } else {
                    elShippingNote.style.display = 'none';
                }
            }

            if (spinner) spinner.style.display = 'none';
            if (content) content.style.display = 'block';
        } else {
            alert("Lỗi tải đơn hàng: " + result.message);
            if (spinner) spinner.style.display = 'none';
        }
    } catch (error) {
        console.error(error);
        if (spinner) spinner.style.display = 'none';
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
