/**
 * ========================================
 * MY-ADS.JS - Quản lý tin đăng của tôi
 * ========================================
 * Lấy toàn bộ xe AVAILABLE rồi lọc client-side theo user_id
 */

document.addEventListener('DOMContentLoaded', async function () {
    const listContainer = document.getElementById('my-ads-list');
    if (!listContainer) return;

    let user = auth.getCurrentUser();
    
    // Nếu chưa có user info hoặc thiếu user_id → fetch lại từ server
    if (!user || !user.user_id) {
        if (auth.isAuthenticated()) {
            await auth.fetchProfile();
            user = auth.getCurrentUser();
        }
    }

    if (!user || !user.user_id) {
        listContainer.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Vui lòng đăng nhập.</td></tr>';
        return;
    }

    try {
        // Lấy toàn bộ xe (limit lớn) rồi lọc phía client theo seller
        const result = await api.get('/api/bikes?limit=50');
        
        if (result.success && result.data && result.data.bikes) {
            // Lọc phía client: so sánh theo tên người bán (vì API không trả seller_id)
            const myBikes = result.data.bikes.filter(bike => bike.seller_name === user.name);
            
            if (myBikes.length === 0) {
                listContainer.innerHTML = '<tr><td colspan="7" class="text-center">Bạn chưa có tin đăng nào.</td></tr>';
                return;
            }

            let html = '';
            myBikes.forEach((bike, idx) => {
                const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bike.price);
                const date = new Date(bike.created_at).toLocaleDateString('vi-VN');
                
                let statusBadge = '';
                if (bike.status === 'AVAILABLE') statusBadge = '<span class="badge bg-success">Đang bán</span>';
                else if (bike.status === 'PENDING') statusBadge = '<span class="badge bg-warning text-dark">Chờ thanh toán</span>';
                else if (bike.status === 'SOLD') statusBadge = '<span class="badge bg-danger">Đã bán</span>';
                else statusBadge = `<span class="badge bg-secondary">${bike.status}</span>`;

                html += `
                    <tr>
                        <td>#${bike.post_id}</td>
                        <td><img src="assets/images/items-grid/img${(idx % 6) + 1}.jpg" alt="Xe" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
                        <td class="fw-bold">${bike.title}</td>
                        <td class="text-primary fw-bold">${formatPrice}</td>
                        <td>${statusBadge}</td>
                        <td>${date}</td>
                        <td>
                            <a href="product-details.php?id=${bike.post_id}" class="btn btn-sm btn-outline-primary" title="Xem chi tiết"><i class="lni lni-eye"></i> Xem</a>
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
