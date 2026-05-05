/**
 * ========================================
 * MY-ADS.JS - Quản lý tin đăng của tôi
 * ========================================
 */

document.addEventListener('DOMContentLoaded', async function () {
    const listContainer = document.getElementById('my-ads-list');
    if (!listContainer) return;

    let user = auth.getCurrentUser();
    
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
        // Gọi với status=ALL để thấy cả tin đã bán/ẩn
        const result = await api.get('/api/bikes?limit=100&status=ALL');
        
        if (result.success && result.data && result.data.bikes) {
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
                let actionBtn = '';

                if (bike.status === 'AVAILABLE') {
                    statusBadge = '<span class="badge bg-success">Đang bán</span>';
                    actionBtn = `<a href="product-details.php?id=${bike.post_id}" class="btn btn-sm btn-outline-primary"><i class="lni lni-eye"></i> Xem</a>`;
                } else {
                    // Nếu không phải AVAILABLE, có khả năng đã có đơn hàng
                    statusBadge = `<span class="badge bg-info">${bike.status === 'SOLD' ? 'Đã bán' : 'Đang giao dịch'}</span>`;
                    // Chúng ta cần tìm order_id liên quan. Hiện tại API /api/bikes chưa trả về order_id.
                    // Tạm thời dẫn tới trang chi tiết, sau này có thể mở rộng API.
                    actionBtn = `<a href="manage-order.php?post_id=${bike.post_id}" class="btn btn-sm btn-warning"><i class="lni lni-cog"></i> Quản lý đơn</a>`;
                }

                const bikeImg = bike.image_url ? bike.image_url : `assets/images/items-grid/img${(idx % 6) + 1}.jpg`;

                html += `
                    <tr>
                        <td>#${bike.post_id}</td>
                        <td><img src="${bikeImg}" alt="Xe" style="width: 60px; height: 40px; object-fit: cover; border-radius: 4px;"></td>
                        <td class="fw-bold">${bike.title}</td>
                        <td class="text-primary fw-bold">${formatPrice}</td>
                        <td>${statusBadge}</td>
                        <td>${date}</td>
                        <td>
                            <div class="d-flex gap-1">
                                ${actionBtn}
                            </div>
                        </td>
                    </tr>
                `;
            });

            listContainer.innerHTML = html;
        }
    } catch (error) {
        listContainer.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Lỗi kết nối máy chủ.</td></tr>';
    }
});
