/**
 * ========================================
 * MY-ORDERS.JS - Quản lý lịch sử mua hàng
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
                listContainer.innerHTML = '<tr><td colspan="7" class="text-center">Bạn chưa có đơn hàng nào.</td></tr>';
                return;
            }

            let html = '';
            orders.forEach(order => {
                const total = Number(order.price) + Number(order.shipping_fee);
                const formatTotal = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
                const date = new Date(order.created_at).toLocaleDateString('vi-VN');
                
                let statusBadge = '';
                if (order.order_status === 'PENDING') statusBadge = '<span class="badge bg-warning text-dark">Chờ thanh toán</span>';
                else if (order.order_status === 'PAID') statusBadge = '<span class="badge bg-success">Đã thanh toán</span>';
                else if (order.order_status === 'SHIPPING') statusBadge = '<span class="badge bg-info">Đang giao</span>';
                else if (order.order_status === 'COMPLETED') statusBadge = '<span class="badge bg-primary">Hoàn thành</span>';
                else if (order.order_status === 'CANCELLED') statusBadge = '<span class="badge bg-danger">Đã hủy</span>';
                else statusBadge = `<span class="badge bg-secondary">${order.order_status}</span>`;

                html += `
                    <tr>
                        <td>#${order.order_id}</td>
                        <td class="fw-bold"><a href="product-details.php?id=${order.post_id}">${order.bike_title}</a></td>
                        <td class="text-primary fw-bold">${formatTotal}</td>
                        <td>${order.payment_method || 'N/A'}</td>
                        <td>${statusBadge}</td>
                        <td>${date}</td>
                        <td>
                            <button class="btn btn-sm btn-outline-secondary" title="Chi tiết" onclick="alert('Đang phát triển tính năng chi tiết đơn hàng')"><i class="lni lni-eye"></i></button>
                            ${order.order_status === 'PENDING' ? `<button class="btn btn-sm btn-outline-danger" title="Hủy đơn" onclick="cancelOrder(${order.order_id})"><i class="lni lni-close"></i></button>` : ''}
                        </td>
                    </tr>
                `;
            });

            listContainer.innerHTML = html;
        } else {
            listContainer.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi: Không thể lấy dữ liệu.</td></tr>';
        }
    } catch (error) {
        listContainer.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi kết nối máy chủ.</td></tr>';
    }
});

// Hàm hủy đơn hàng
window.cancelOrder = async function(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;
    
    try {
        const result = await api.delete('/api/orders/' + orderId);
        if (result.success) {
            alert('Hủy đơn hàng thành công!');
            window.location.reload();
        } else {
            alert('Lỗi: ' + result.message);
        }
    } catch (err) {
        alert('Lỗi kết nối khi hủy đơn hàng.');
    }
};
