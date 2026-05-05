/**
 * ========================================
 * MY-ORDERS.JS - Lịch sử mua hàng
 * ========================================
 */

document.addEventListener('DOMContentLoaded', async function () {
    const listContainer = document.getElementById('my-orders-list');
    if (!listContainer) return;

    try {
        const result = await api.get('/api/orders/my');
        
        if (result.success && result.data) {
            const orders = result.data;
            
            if (orders.length === 0) {
                listContainer.innerHTML = '<tr><td colspan="7" class="text-center">Bạn chưa mua sản phẩm nào.</td></tr>';
                return;
            }

            let html = '';
            orders.forEach(order => {
                const totalPrice = Number(order.price) + (Number(order.shipping_fee) || 0);
                const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice);
                const date = new Date(order.created_at).toLocaleDateString('vi-VN');
                
                let statusBadge = '';
                if (order.order_status === 'PENDING') statusBadge = '<span class="badge bg-warning text-dark">Chờ xử lý</span>';
                else if (order.order_status === 'SHIPPING') statusBadge = '<span class="badge bg-primary">Đang giao</span>';
                else if (order.order_status === 'COMPLETED') statusBadge = '<span class="badge bg-success">Hoàn tất</span>';
                else if (order.order_status === 'CANCELLED') statusBadge = '<span class="badge bg-danger">Đã hủy</span>';
                else statusBadge = `<span class="badge bg-secondary">${order.order_status}</span>`;

                html += `
                    <tr>
                        <td>#${order.order_id}</td>
                        <td class="fw-bold text-truncate" style="max-width: 200px;">${order.bike_title}</td>
                        <td>${order.seller_name}</td>
                        <td class="text-primary fw-bold">${formatPrice}</td>
                        <td>${statusBadge}</td>
                        <td>${date}</td>
                        <td>
                            <a href="order-details.php?id=${order.order_id}" class="btn btn-sm btn-outline-info">
                                <i class="lni lni-search"></i> Chi tiết
                            </a>
                        </td>
                    </tr>
                `;
            });

            listContainer.innerHTML = html;
        }
    } catch (error) {
        console.error(error);
        listContainer.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi kết nối máy chủ.</td></tr>';
    }
});
